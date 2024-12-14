# **Blank Remover Scan Tool**

## **Description**

CCS Blank Remover is a desktop application designed to simplify and automate the process of cleaning up scanned document folders. The app allows users to select a folder with scanned files and automatically removes blank pages. This is particularly useful for teams working with large volumes of scanned documents to ensure only meaningful content is preserved.

---

## **Features**

- User-friendly interface to select folders.
- Automatic detection and removal of blank pages using image analysis.
- Cross-platform compatibility (Windows, macOS, Linux).
- Built with modern, lightweight technologies.

---

## **Tech Stack**

### **Frontend**
- **Electron.js**: For building the desktop application's user interface.

### **Backend**
- **Python**: For image processing and page analysis.
- **OpenCV**: For blank page detection using image processing techniques.

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
- Node.js and npm installed on your machine.
- Python installed (with `opencv-python` library).

### Steps
1. Clone this repository:
   ```bash
   git clone https://github.com/yburdakova/ccs-blank-remover.git
   cd ccs-blank-remover
