require('dotenv').config()

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// GitHub Repository details    
    const GITHUB_REPO = "vishnucyblnk/Hmsbackend";
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // GitHub Token stored in environment variable

// Temperory Place Before Uploading to github
    exports.uploadImageAndPdf = async (req, res) => {
        console.log("Inside image/pdf uploading first function");
        const file = req.file;
    
        if (!file) {
            return res.status(400).json({ error: "No file uploaded or unsupported file type" });
        }
    
        try {
            const fileType = req.file.fieldname === 'profImg' ? 'image' : 'pdf';  // Determine the file type
            const filePath = path.join(__dirname, '..', 'uploads', fileType + 's', file.filename);
            const fileContent = fs.readFileSync(filePath, { encoding: 'base64' });
            await uploadToGitHub(file.filename, fileContent, fileType);
            // fs.unlinkSync(filePath);    // Delete the file after upload
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

// Function to upload file to GitHub
    const uploadToGitHub = async (fileName, content, fileType) => {
        try {
            console.log(`Uploading ${fileType} to GitHub: ${fileName}`);
            const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/uploads/${fileType}s/${fileName}`;
            const data = {
                message: `Add ${fileName}`,
                content: content
            };
            const headers = {
                "Authorization": `token ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json"
            };

            await axios.put(url, data, { headers });
            console.log(`${fileType} uploaded to GitHub successfully: ${fileName}`);
        } catch (error) {
            throw new Error(`Failed to upload ${fileType} to GitHub: ${error.message}`);
        }
    };
    

// Function to edit/change files in GitHub
    exports.editInGitHub = async (prevFile,uploadedFile,fileType) => {
        try{
            console.log(`Editing ${fileType} in GitHub: ${prevFile} to ${uploadedFile}`);
            if (prevFile) {
                await deleteFromGitHub(prevFile, fileType);
            }
            const filePath = path.join(__dirname, '..', 'uploads', `${fileType}s`, uploadedFile);
            const fileContent = fs.readFileSync(filePath, { encoding: 'base64' });
            await uploadToGitHub(uploadedFile, fileContent, fileType);
            // fs.unlinkSync(filePath); // Delete the file after upload

            console.log(`${fileType} edited in GitHub successfully: ${uploadedFile}`);

        } catch (error) {
            throw new Error(`Failed to edit ${fileType} in GitHub: ${error.message}`);
        }
    };

// Function to delete file from GitHub
    const deleteFromGitHub = async (fileName, fileType) => {
        try {
            console.log(`Deleting ${fileType} from GitHub: ${fileName}`);
            const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/uploads/${fileType}s/${fileName}`;
            const headers = {
                "Authorization": `token ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json"
            };
    
            // Get the SHA of the file to delete
            const { data } = await axios.get(url, { headers });
            const sha = data.sha;
    
            // Delete the file
            const deleteData = {
                message: `Delete ${fileName}`,
                sha: sha
            };
    
            await axios.delete(url, { data: deleteData, headers });
            console.log(`${fileType} deleted from GitHub successfully: ${fileName}`);
        } catch (error) {
            throw new Error(`Failed to delete ${fileType} from GitHub: ${error.message}`);
        }
    };

    exports.deleteFromGitHub = deleteFromGitHub;
