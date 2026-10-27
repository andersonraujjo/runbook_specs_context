#!/usr/bin/env python3
"""Interface gráfica Tkinter para meu-pdf — só chama a CLI (node build.mjs)."""

from __future__ import annotations

import json
import os
import queue
import shutil
import subprocess
import sys
import threading
from pathlib import Path
import tkinter as tk
from tkinter import filedialog, messagebox, ttk

THEME_NONE = "(nenhum)"
DEFAULT_PRESET = "terminal"
DEFAULT_HEADER = "Anderson Araujo"
SETTINGS_NAME = "settings.json"


def enable_windows_dpi_awareness() -> None:
    """Evita blur em monitores HiDPI: o SO deixa de escalar o Tk como bitmap."""
    if sys.platform != "win32":
        return
    try:
        import ctypes

        # Per-monitor v2 (Win10 1703+)
        DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2 = ctypes.c_void_p(-4)
        ctypes.windll.user32.SetProcessDpiAwarenessContext(
            DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2
        )
        return
    except Exception:
        pass
    try:
        import ctypes

        ctypes.windll.shcore.SetProcessDpiAwareness(2)  # PER_MONITOR_AWARE
        return
    except Exception:
        pass
    try:
        import ctypes

        ctypes.windll.user32.SetProcessDPIAware()
    except Exception:
        pass

# Paleta escura
BG = "#1a1d23"
BG2 = "#12141a"
FG = "#e6e8ee"
FG_MUTED = "#9aa0ad"
ACCENT = "#3ddc97"
ENTRY_BG = "#0e1014"
BORDER = "#2c313c"


def discover_root() -> Path:
    if getattr(sys, "frozen", False):
        start = Path(sys.executable).resolve().parent
    else:
        start = Path(__file__).resolve().parent.parent

    cur = start
    for _ in range(4):
        if (cur / "build.mjs").is_file():
            return cur
        parent = cur.parent
        if parent == cur:
            break
        cur = parent
    return start


def settings_path(root: Path) -> Path:
    if getattr(sys, "frozen", False):
        return Path(sys.executable).resolve().parent / SETTINGS_NAME
    return Path(__file__).resolve().parent / SETTINGS_NAME


def list_css_names(folder: Path) -> list[str]:
    if not folder.is_dir():
        return []
    return sorted(p.stem for p in folder.glob("*.css") if p.is_file())


def load_settings(path: Path) -> dict:
    defaults = {
        "last_md": "",
        "last_dir": "",
        "preset": DEFAULT_PRESET,
        "theme": THEME_NONE,
        "header": DEFAULT_HEADER,
        "open_pdf": True,
    }
    if not path.is_file():
        return defaults
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(data, dict):
            return defaults
        out = dict(defaults)
        out.update({k: data[k] for k in defaults if k in data})
        return out
    except (OSError, json.JSONDecodeError, TypeError, ValueError):
        return defaults


def save_settings(path: Path, data: dict) -> None:
    try:
        path.write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    except OSError:
        pass


def open_path(target: Path) -> None:
    target = Path(target)
    if sys.platform == "win32":
        os.startfile(str(target))  # type: ignore[attr-defined]
    elif sys.platform == "darwin":
        subprocess.Popen(["open", str(target)], shell=False)
    else:
        subprocess.Popen(["xdg-open", str(target)], shell=False)


def apply_dark_theme(root: tk.Tk) -> None:
    root.configure(bg=BG)
    style = ttk.Style(root)
    try:
        style.theme_use("clam")
    except tk.TclError:
        pass

    style.configure(".", background=BG, foreground=FG, fieldbackground=ENTRY_BG)
    style.configure("TFrame", background=BG)
    style.configure("TLabel", background=BG, foreground=FG)
    style.configure("Muted.TLabel", background=BG, foreground=FG_MUTED)
    style.configure(
        "TButton",
        background=BORDER,
        foreground=FG,
        bordercolor=BORDER,
        focusthickness=1,
        focuscolor=ACCENT,
        padding=(10, 6),
    )
    style.map(
        "TButton",
        background=[("active", "#3a4150"), ("disabled", "#252830")],
        foreground=[("disabled", FG_MUTED)],
    )
    style.configure(
        "Accent.TButton",
        background=ACCENT,
        foreground="#0c1210",
        padding=(12, 6),
    )
    style.map(
        "Accent.TButton",
        background=[("active", "#5ae6ad"), ("disabled", "#1e3d30")],
        foreground=[("disabled", "#6a8a7a")],
    )
    style.configure(
        "TEntry",
        fieldbackground=ENTRY_BG,
        foreground=FG,
        insertcolor=FG,
        bordercolor=BORDER,
        lightcolor=BORDER,
        darkcolor=BORDER,
        padding=4,
    )
    style.map("TEntry", fieldbackground=[("disabled", BG2)])
    style.configure(
        "TCombobox",
        fieldbackground=ENTRY_BG,
        background=ENTRY_BG,
        foreground=FG,
        arrowcolor=FG,
        bordercolor=BORDER,
        lightcolor=BORDER,
        darkcolor=BORDER,
        padding=4,
    )
    style.map(
        "TCombobox",
        fieldbackground=[("readonly", ENTRY_BG)],
        selectbackground=[("readonly", ENTRY_BG)],
        selectforeground=[("readonly", FG)],
        foreground=[("readonly", FG)],
    )
    root.option_add("*TCombobox*Listbox.background", ENTRY_BG)
    root.option_add("*TCombobox*Listbox.foreground", FG)
    root.option_add("*TCombobox*Listbox.selectBackground", ACCENT)
    root.option_add("*TCombobox*Listbox.selectForeground", "#0c1210")

    style.configure(
        "TCheckbutton",
        background=BG,
        foreground=FG,
        indicatorcolor=ENTRY_BG,
        indicatormargin=4,
    )
    style.map(
        "TCheckbutton",
        background=[("active", BG)],
        indicatorcolor=[("selected", ACCENT), ("!selected", ENTRY_BG)],
    )
    style.configure(
        "Horizontal.TProgressbar",
        troughcolor=BG2,
        background=ACCENT,
        bordercolor=BG2,
        lightcolor=ACCENT,
        darkcolor=ACCENT,
    )
    style.configure(
        "Vertical.TScrollbar",
        background=BORDER,
        troughcolor=BG2,
        bordercolor=BG2,
        arrowcolor=FG,
    )


class App(tk.Tk):
    def __init__(self) -> None:
        super().__init__()
        self.title("meu-pdf")
        self.minsize(640, 480)
        self.geometry("740x560")
        apply_dark_theme(self)

        self.root_dir = discover_root()
        self.settings_file = settings_path(self.root_dir)
        self.settings = load_settings(self.settings_file)

        if not (self.root_dir / "build.mjs").is_file():
            messagebox.showerror(
                "meu-pdf",
                "Não encontrei build.mjs.\n"
                "O executável (ou a pasta ui/) precisa ficar dentro do projeto meu-pdf "
                "(ao lado de build.mjs, presets/, themes/).",
            )
            self.destroy()
            return

        self.node = shutil.which("node")
        if not self.node:
            messagebox.showerror(
                "meu-pdf",
                "Node.js não encontrado. Instale o Node 20+ e reabra.",
            )
            self.destroy()
            return

        if not (self.root_dir / "node_modules").is_dir():
            messagebox.showwarning(
                "meu-pdf",
                "Pasta node_modules/ não encontrada.\n"
                "Na raiz do projeto rode:\n"
                "  npm install\n"
                "  npx playwright install chromium",
            )

        self.presets = list_css_names(self.root_dir / "presets") or [DEFAULT_PRESET]
        self.themes = [THEME_NONE] + list_css_names(self.root_dir / "themes")

        self.log_q: queue.Queue[str | tuple[str, int]] = queue.Queue()
        self.proc: subprocess.Popen[str] | None = None
        self.busy = False

        self._build_ui()
        self._load_ui_from_settings()
        self.protocol("WM_DELETE_WINDOW", self._on_close)
        self.after(50, self._drain_log)

    def _build_ui(self) -> None:
        pad = {"padx": 8, "pady": 5}
        frm = ttk.Frame(self, padding=12)
        frm.pack(fill=tk.BOTH, expand=True)
        frm.columnconfigure(1, weight=1)

        ttk.Label(frm, text="Arquivo Markdown:").grid(row=0, column=0, sticky="w", **pad)
        self.md_var = tk.StringVar()
        ttk.Entry(frm, textvariable=self.md_var).grid(row=0, column=1, sticky="ew", **pad)
        ttk.Button(frm, text="Procurar...", command=self._browse).grid(
            row=0, column=2, sticky="e", **pad
        )

        ttk.Label(frm, text="Cabeçalho (PDF):").grid(row=1, column=0, sticky="w", **pad)
        self.header_var = tk.StringVar()
        ttk.Entry(frm, textvariable=self.header_var).grid(
            row=1, column=1, columnspan=2, sticky="ew", **pad
        )

        ttk.Label(frm, text="Preset:").grid(row=2, column=0, sticky="w", **pad)
        self.preset_var = tk.StringVar()
        ttk.Combobox(
            frm,
            textvariable=self.preset_var,
            values=self.presets,
            state="readonly",
        ).grid(row=2, column=1, sticky="ew", **pad)

        ttk.Label(frm, text="Tema:").grid(row=3, column=0, sticky="w", **pad)
        self.theme_var = tk.StringVar()
        ttk.Combobox(
            frm,
            textvariable=self.theme_var,
            values=self.themes,
            state="readonly",
        ).grid(row=3, column=1, sticky="ew", **pad)

        self.open_var = tk.BooleanVar(value=True)
        ttk.Checkbutton(
            frm, text="Abrir PDF ao terminar", variable=self.open_var
        ).grid(row=4, column=1, sticky="w", **pad)

        btns = ttk.Frame(frm)
        btns.grid(row=5, column=0, columnspan=3, sticky="ew", **pad)
        self.convert_btn = ttk.Button(
            btns, text="Converter", style="Accent.TButton", command=self._convert
        )
        self.convert_btn.pack(side=tk.LEFT, padx=(0, 8))
        ttk.Button(btns, text="Abrir pasta de saída", command=self._open_out).pack(
            side=tk.LEFT
        )
        self.status_var = tk.StringVar(value="Pronto")
        ttk.Label(btns, textvariable=self.status_var, style="Muted.TLabel").pack(
            side=tk.RIGHT
        )

        self.progress = ttk.Progressbar(frm, mode="indeterminate")
        self.progress.grid(row=6, column=0, columnspan=3, sticky="ew", padx=8, pady=4)

        frm.rowconfigure(7, weight=1)
        log_frm = ttk.Frame(frm)
        log_frm.grid(row=7, column=0, columnspan=3, sticky="nsew", **pad)
        log_frm.columnconfigure(0, weight=1)
        log_frm.rowconfigure(0, weight=1)

        self.log = tk.Text(
            log_frm,
            wrap=tk.WORD,
            height=16,
            state=tk.DISABLED,
            font=("Consolas", 10),
            bg=ENTRY_BG,
            fg=FG,
            insertbackground=FG,
            selectbackground=ACCENT,
            selectforeground="#0c1210",
            relief=tk.FLAT,
            highlightthickness=1,
            highlightbackground=BORDER,
            highlightcolor=ACCENT,
            padx=8,
            pady=8,
        )
        scroll = ttk.Scrollbar(log_frm, orient=tk.VERTICAL, command=self.log.yview)
        self.log.configure(yscrollcommand=scroll.set)
        self.log.grid(row=0, column=0, sticky="nsew")
        scroll.grid(row=0, column=1, sticky="ns")

    def _load_ui_from_settings(self) -> None:
        preset = self.settings.get("preset") or DEFAULT_PRESET
        if preset not in self.presets:
            preset = DEFAULT_PRESET if DEFAULT_PRESET in self.presets else self.presets[0]
        self.preset_var.set(preset)

        theme = self.settings.get("theme") or THEME_NONE
        if theme not in self.themes:
            theme = THEME_NONE
        self.theme_var.set(theme)

        self.header_var.set(self.settings.get("header") or DEFAULT_HEADER)
        self.open_var.set(bool(self.settings.get("open_pdf", True)))
        last = self.settings.get("last_md") or ""
        if last and Path(last).is_file():
            self.md_var.set(last)

    def _persist(self) -> None:
        md = self.md_var.get().strip()
        data = {
            "last_md": md,
            "last_dir": str(Path(md).parent) if md else self.settings.get("last_dir", ""),
            "preset": self.preset_var.get() or DEFAULT_PRESET,
            "theme": self.theme_var.get() or THEME_NONE,
            "header": self.header_var.get().strip() or DEFAULT_HEADER,
            "open_pdf": bool(self.open_var.get()),
        }
        if md:
            data["last_dir"] = str(Path(md).parent)
        self.settings = data
        save_settings(self.settings_file, data)

    def _append_log(self, text: str) -> None:
        self.log.configure(state=tk.NORMAL)
        self.log.insert(tk.END, text)
        self.log.see(tk.END)
        self.log.configure(state=tk.DISABLED)

    def _drain_log(self) -> None:
        try:
            while True:
                item = self.log_q.get_nowait()
                if isinstance(item, tuple) and item[0] == "__done__":
                    self._on_done(item[1])
                else:
                    self._append_log(str(item))
        except queue.Empty:
            pass
        self.after(50, self._drain_log)

    def _browse(self) -> None:
        initial = self.settings.get("last_dir") or ""
        if not initial or not Path(initial).is_dir():
            docs = self.root_dir / "docs"
            initial = str(docs if docs.is_dir() else self.root_dir)
        path = filedialog.askopenfilename(
            title="Escolher Markdown",
            initialdir=initial,
            filetypes=[("Markdown", "*.md"), ("Todos", "*.*")],
        )
        if path:
            self.md_var.set(path)
            self._persist()

    def _open_out(self) -> None:
        out = self.root_dir / "out"
        out.mkdir(parents=True, exist_ok=True)
        open_path(out)

    def _set_busy(self, busy: bool) -> None:
        self.busy = busy
        self.convert_btn.configure(state=tk.DISABLED if busy else tk.NORMAL)
        if busy:
            self.progress.start(12)
            self.status_var.set("Convertendo…")
        else:
            self.progress.stop()

    def _convert(self) -> None:
        if self.busy:
            return
        md = self.md_var.get().strip().strip('"')
        if not md:
            messagebox.showwarning("meu-pdf", "Escolha um arquivo .md.")
            return
        path = Path(md)
        if not path.is_file():
            messagebox.showerror("meu-pdf", f"Arquivo não encontrado:\n{path}")
            return
        if path.suffix.lower() != ".md":
            messagebox.showerror("meu-pdf", "O arquivo precisa terminar em .md.")
            return

        preset = self.preset_var.get() or DEFAULT_PRESET
        theme = self.theme_var.get() or THEME_NONE
        header = self.header_var.get().strip() or DEFAULT_HEADER
        self._persist()

        cmd = [
            self.node,
            "build.mjs",
            str(path.resolve()),
            "--preset",
            preset,
            "--header",
            header,
        ]
        if theme and theme != THEME_NONE:
            cmd.extend(["--theme", theme])

        self._append_log(f"\n$ {' '.join(cmd)}\n")
        self._set_busy(True)

        def worker() -> None:
            creationflags = 0
            if sys.platform == "win32":
                creationflags = subprocess.CREATE_NO_WINDOW  # type: ignore[attr-defined]
            try:
                self.proc = subprocess.Popen(
                    cmd,
                    cwd=str(self.root_dir),
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    encoding="utf-8",
                    errors="replace",
                    shell=False,
                    creationflags=creationflags,
                )
                assert self.proc.stdout is not None
                for line in self.proc.stdout:
                    self.log_q.put(line)
                code = self.proc.wait()
            except OSError as exc:
                self.log_q.put(f"\n[erro] {exc}\n")
                code = 1
            finally:
                self.proc = None
            self.log_q.put(("__done__", code))

        threading.Thread(target=worker, daemon=True).start()

    def _on_done(self, code: int) -> None:
        self._set_busy(False)
        if code == 0:
            self.status_var.set("PDF gerado")
            self._append_log("[ok] conversão concluída\n")
            md = Path(self.md_var.get().strip().strip('"'))
            pdf = self.root_dir / "out" / f"{md.stem}.pdf"
            preset = self.preset_var.get() or DEFAULT_PRESET
            theme = self.theme_var.get() or THEME_NONE
            bits: list[str] = []
            if preset and preset != DEFAULT_PRESET:
                bits.append(preset)
            if theme and theme != THEME_NONE:
                bits.append(theme)
            if bits:
                pdf = self.root_dir / "out" / f"{md.stem}-{'-'.join(bits)}.pdf"
            if self.open_var.get() and pdf.is_file():
                try:
                    open_path(pdf)
                except OSError as exc:
                    self._append_log(f"[aviso] não abriu o PDF: {exc}\n")
            elif self.open_var.get() and not pdf.is_file():
                self._append_log(f"[aviso] PDF não encontrado: {pdf}\n")
        else:
            self.status_var.set(f"Erro (código {code})")
            self._append_log(f"\n[erro] exit code {code}\n")
            messagebox.showerror(
                "meu-pdf",
                f"A conversão falhou (código {code}).\nVeja o log para detalhes.",
            )

    def _on_close(self) -> None:
        if self.proc and self.proc.poll() is None:
            try:
                self.proc.terminate()
            except OSError:
                pass
        self._persist()
        self.destroy()


def main() -> None:
    enable_windows_dpi_awareness()
    app = App()
    if app.winfo_exists():
        app.mainloop()


if __name__ == "__main__":
    main()
