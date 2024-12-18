# **Blank Remover Scan Tool**

## **Description**

Blank Remover is a desktop application designed to simplify and automate the process of cleaning up scanned document folders. The app allows users to select a folder with scanned files and automatically removes blank pages. This is particularly useful for teams working with large volumes of scanned documents to ensure only meaningful content is preserved.

---

## **Features**

- User-friendly interface to select folders.
- Automatic detection and removal of blank pages using image analysis.
- Cross-platform compatibility (Windows, macOS).
- Built with modern, lightweight technologies.

---

## **Tech Stack**

### **Frontend**
- **Electron.js**: For building the desktop application's user interface.

### **Backend**
- **Python**: For image processing and page analysis.
- **Pillow**: For blank page detection and image analysis.

### **Storage**
- **electron-store**: For saving user settings locally.

### **Other Tools**
- **Node.js**: For managing dependencies and application runtime.
- **npm**: For managing project dependencies.

---

## **How It Works**

1. The user selects a folder containing scanned images.
2. The application analyzes each file in the folder to detect blank pages.
3. Detected blank pages are automatically deleted from the folder.
4. A completion message is displayed to the user.

---

## **Installation**

### Prerequisites
- **Node.js** and **npm** installed on your machine.
- **Python 3.12+** installed (with `Pillow` library).

### Steps

1. **Clone this repository**:
  ```bash
   git clone https://github.com/yburdakova/blank-remover.git
   cd blank-remover
   ```

2. **Install project dependencies**:
```npm install```
Set up Python dependencies (for local development):

Make sure you have a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows
```
Install the required Python library:
```bash
pip install pillow
```
Portable Python Setup (Windows only):
Download the portable Python 3.12.4 version from the official website.
Extract the downloaded WinPython package.
Place the extracted folder in:
```resources\app\WPy64-31241\python-3.12.4.amd64\```
Note: The app automatically detects and uses the portable Python version during execution.

Run the application:
```npm start```

Packaging for Deployment
You can package the app for Windows and macOS:
```npm run package```

After packaging, the output files will be located in the release-build/ directory.

3. **Usage**
1. Launch the application.
2. Select a folder containing scanned images.
3. Click "Remove Blank Pages" to analyze and clean the folder.
4. Confirm the process completion with the displayed message.

4. **Supported File Types**
.png, .jpg, .jpeg, .tif, .tiff, .bmp

5. **Portable Python Notes**
Version: Python 3.12.4 (WinPython)
Folder Path: Place the portable Python in resources\app\
This approach avoids the need to install Python system-wide on the target machine.

# Developer

- **Name**: Yana Burdakova
- **Email**: burdakovacom@gmail.com
- **Portfolio**: https://burdakova.com
- **LinkedIn**: [Yana Burdakova LinkedIn Profile](https://www.linkedin.com/in/yana-burdakova/)
