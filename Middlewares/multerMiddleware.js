const multer = require('multer')

// -----------image multer--------------------------------------------------------
        const imageStorage = multer.diskStorage({
            destination:(req,file,callback)=>{
                callback(null,'./uploads/images')
            },
            filename: (req,file,callback)=>{
                const filename= `Image-${Date.now()}-${file.originalname}`
                callback(null,filename)
            }
        })

        const imageFileFilter = (req,file,callback)=>{
            if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimmetype === "image/jpg"){
                callback(null,true);
            }else{
                callback(null,false)
                return callback(new Error("Only .png, .jpg , .jpeg file are allowed!!!"))
            }
        }


// ------------pdf multer----------------------------------------------------------
        const pdfStorage = multer.diskStorage({
            destination:(req,file,callback)=>{
                callback(null,'./uploads/pdfs')
            },
            filename:(req,file,callback)=>{
                const filename= `TestReport-${Date.now()}-${file.originalname}`
                callback(null,filename)
            }
        })

        const pdfFileFilter = (req,file,callback)=>{
            if(file.mimetype === "application/pdf" ){
                callback(null,true)
            }else{
                callback(null,false)
                return callback(new Error("Only .pdf file are allowed!!!"))
            }
        }



const multerConfig = (fileType) =>{
    let storage,fileFilter;
    if(fileType === 'image'){
        storage = imageStorage;
        fileFilter = imageFileFilter;
    }else if (fileType === 'pdf') {
        storage = pdfStorage;
        fileFilter = pdfFileFilter;
    }else{
        throw new Error("Unsupported file type!");
    }
    return multer({
        storage,
        fileFilter
    });
};


module.exports = multerConfig