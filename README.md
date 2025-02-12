# English Version

# SunoDownloader

> A tool to download MP3 files and convert them to WAV using Node.js and FFmpeg.

## Description

This project allows you to download audio files in MP3 format from URLs provided in the `input.txt` file and convert them to WAV format using the `fluent-ffmpeg` library. The tool manages the download and conversion progress in real-time.

## Features

- Downloads MP3 files from URLs listed in the `input.txt` file.
- Automatically converts MP3 files to WAV.
- Real-time display of download and conversion progress in the console.

## Requirements

- Node.js (LTS is recommended).
- FFmpeg must be installed on your system and accessible in the system PATH.

## Installation

1. Clone the repository.
2. Run `npm install` to install the project dependencies.
3. Ensure that FFmpeg is installed and properly configured in your system.

## Usage

1. Place the MP3 file URLs in the `input.txt` file, separated by spaces.
2. Run the command: `npm run start`.
3. Monitor the download and conversion progress in the console.

**Extracting URLs directly from the web**

If you prefer not to use the `input.txt` file, you can obtain the MP3 URLs directly from the web interface by following these steps:

1. Open the webpage that lists the MP3 files.
2. Open your browser's developer console (e.g., press F12 or Ctrl+Shift+I).
3. Copy and paste the following command into the console and press Enter:

```javascript
copy([...$('[role="grid"]')[Object.keys($('[role="grid"]')).filter(x => x.startsWith('__reactProps'))[0]].children[0].props.values[0][1].collection].filter(x => x.value.audio_url).map(x => x.value.audio_url).join(' '))
```

4. The command will copy all MP3 file URLs to your clipboard, which you can then use with tools like `wget` to download them.

## Project Structure

- `index.js`: Main file that handles the download and conversion processes.
- `input.txt`: File containing the MP3 URLs.
- `package.json`: Project configuration and dependency file.
- `downloads/`: Folder where downloaded files are stored.
- `outputs/`: Folder where WAV converted files are saved.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License. Use is permitted, but not for commercial purposes and without modifications.

For more information, visit [Creative Commons](https://creativecommons.org/licenses/by-nc-nd/4.0/).

## Contributing

Contributions are welcome. Please open an issue to discuss any changes or improvements.

## Contact

If you encounter any problems or have any questions, please open an issue on GitHub.


# Spanish Version


# SunoDownloader

> Una herramienta para descargar archivos MP3 y convertirlos a WAV utilizando Node.js y FFmpeg.

## Descripción

Este proyecto permite descargar archivos de audio en formato .mp3 desde URLs proporcionadas en el archivo `input.txt` y convertirlos a formato .wav utilizando la librería `fluent-ffmpeg`. La herramienta gestiona el progreso de descarga y conversión en tiempo real.

## Características

- Descarga archivos MP3 de URLs listadas en el archivo `input.txt`.
- Conversión automática de archivos MP3 a WAV.
- Visualización en tiempo real del progreso de descarga y conversión en la consola.

## Requisitos

- Node.js (versión LTS recomendada).
- FFmpeg instalado en el sistema y accesible en la variable PATH.

## Instalación

1. Clona el repositorio.
2. Ejecuta `npm install` para instalar las dependencias.
3. Asegúrate de tener FFmpeg instalado y configurado correctamente en tu sistema.

## Uso

1. Coloca las URLs de los archivos MP3 en el archivo `input.txt`, separadas por espacios.
2. Ejecuta el comando: `npm run start`.
3. Observa el progreso de descarga y conversión en la consola.

**Extracción de URLs directamente desde la web**

Si prefieres no usar el archivo `input.txt`, puedes obtener las URLs de los archivos MP3 directamente desde la interfaz web. Para ello, sigue estos pasos:

1. Abre la página web que contiene la lista de archivos MP3.
2. Abre la consola de desarrollo de tu navegador (por ejemplo, con F12 o Ctrl+Shift+I en la mayoría de los navegadores).
3. Copia y pega el siguiente comando en la consola y presiona Enter:

```javascript
copy([...$('[role="grid"]')[Object.keys($('[role="grid"])').filter(x => x.startsWith('__reactProps'))[0]].children[0].props.values[0][1].collection].filter(x => x.value.audio_url).map(x => x.value.audio_url).join(' '))
```

4. El comando copiará en el portapapeles todas las URLs de archivos MP3, que luego podrás utilizar con herramientas como `wget` para descargarlas.

## Estructura del Proyecto

- `index.js`: Archivo principal que gestiona la descarga y conversión de archivos.
- `input.txt`: Archivo que debe contener las URLs de los archivos MP3.
- `package.json`: Archivo de configuración del proyecto y dependencias.
- `downloads/`: Carpeta donde se almacenan los archivos descargados.
- `outputs/`: Carpeta donde se guardan los archivos convertidos a WAV.

## Licencia

Este proyecto se distribuye bajo la licencia ISC. Consulta el archivo `package.json` para más detalles.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir cambios o mejoras.

## Contacto

Si encuentras algún problema o tienes alguna duda, no dudes en abrir un issue en GitHub.

## Licencia

Este proyecto está licenciado bajo la Licencia Creative Commons Atribución-NoComercial-SinDerivadas 4.0 Internacional. Se permite su uso, pero no su uso comercial ni la modificación del contenido.

Para más información, visita [Creative Commons](https://creativecommons.org/licenses/by-nc-nd/4.0/).

---

Generado automáticamente.