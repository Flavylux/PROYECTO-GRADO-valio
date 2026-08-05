from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs
from urllib.request import urlopen
from urllib.error import URLError, HTTPError
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent
INDEX_PATH = ROOT / "index.html"


class PortfolioHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/info":
            self._serve_api_info()
            return

        if path in {"/", "/index.html", "/proyecto.html", "/proyecto"}:
            self._serve_file(INDEX_PATH, 200)
            return

        if path.endswith("/"):
            self._serve_file(ROOT / path.strip("/") / "index.html", 200)
            return

        target = ROOT / path.lstrip("/")
        if target.exists() and target.is_file():
            self._serve_file(target, 200)
            return

        if "." not in Path(path).name:
            html_candidate = ROOT / f"{path.lstrip('/')}.html"
            if html_candidate.exists():
                self._serve_file(html_candidate, 200)
                return

        self._serve_file(ROOT / "404.html", 404)

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path != "/contacto":
            self.send_error(404)
            return

        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length).decode("utf-8")
        data = parse_qs(body)

        nombre = data.get("nombre", [""])[0].strip()
        correo = data.get("correo", [""])[0].strip()
        mensaje = data.get("mensaje", [""])[0].strip()

        if nombre and correo and mensaje:
            entry = {
                "nombre": nombre,
                "correo": correo,
                "mensaje": mensaje,
            }
            messages_path = ROOT / "messages.json"
            messages = []
            if messages_path.exists():
                with messages_path.open("r", encoding="utf-8") as fh:
                    messages = json.load(fh)
            messages.append(entry)
            with messages_path.open("w", encoding="utf-8") as fh:
                json.dump(messages, fh, ensure_ascii=False, indent=2)

            response_body = b"Mensaje enviado correctamente."
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", str(len(response_body)))
            self.end_headers()
            self.wfile.write(response_body)
        else:
            response_body = b"Faltan datos del formulario."
            self.send_response(400)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", str(len(response_body)))
            self.end_headers()
            self.wfile.write(response_body)

    def _serve_file(self, file_path, status_code):
        if not file_path.exists():
            self.send_error(404, "Archivo no encontrado")
            return

        content_type = "text/html; charset=utf-8"
        if file_path.suffix == ".css":
            content_type = "text/css; charset=utf-8"
        elif file_path.suffix == ".js":
            content_type = "application/javascript; charset=utf-8"
        elif file_path.suffix == ".json":
            content_type = "application/json; charset=utf-8"

        self.send_response(status_code)
        self.send_header("Content-Type", content_type)
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        with file_path.open("rb") as fh:
            self.wfile.write(fh.read())

    def _serve_api_info(self):
        payload = {
            "message": "Información dinámica desde la web",
            "source": "https://www.boredapi.com/api/activity",
            "data": None,
            "status": "ok",
        }

        try:
            with urlopen("https://www.boredapi.com/api/activity", timeout=5) as response:
                payload["data"] = json.load(response)
        except (URLError, HTTPError, TimeoutError, ValueError):
            payload["status"] = "fallback"
            payload["message"] = "No se pudo consultar la web, pero la API está lista para usarla."
            payload["data"] = {"activity": "Explorar nuevas ideas", "type": "education"}

        body = json.dumps(payload).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        return


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    server = ThreadingHTTPServer(("0.0.0.0", port), PortfolioHandler)
    print(f"Servidor activo en http://localhost:{port}")
    server.serve_forever()
