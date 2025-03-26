import multer from 'multer';
import path from 'path';
import fs from 'fs';


// exist upload folder ? create it
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const uploadPath = path.join(uploadDir, `${year}`, `${month}`);

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const originalName = file.originalname.toLowerCase();
        const nameWithoutExt = path.parse(originalName).name;
        const ext = path.extname(originalName);
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);

        // Format: original-name-timestamp-random.ext
        const finalName = `${nameWithoutExt}-${timestamp}-${randomString}${ext}`;
        cb(null, finalName);
    }
});


// file filter & validation
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'));
    }
};

// upload config
export const uploadConfig = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    }
}); 