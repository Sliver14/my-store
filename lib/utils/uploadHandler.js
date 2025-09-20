import formidable from 'formidable';
import path from 'path';
import fs from 'fs';

export const parseMultipartForm = async (req) => {
    return new Promise((resolve, reject) => {
        const uploadDir = path.join(process.cwd(), 'tmp'); // Temporary directory for uploads

        // Ensure the upload directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const form = formidable({
            uploadDir: uploadDir,
            keepExtensions: true,
            multiples: true, // Allow multiple files for the same field name
            filename: (name, ext, part) => {
                // Use original filename for now, can be customized
                return `${part.originalFilename}`;
            },
        });

        form.parse(req, (err, fields, files) => {
            if (err) {
                return reject(err);
            }

            // formidable returns fields as arrays if multiple values exist for the same key.
            // Convert them to single values if only one is expected.
            const parsedFields = {};
            for (const key in fields) {
                parsedFields[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
            }

            // formidable returns files as arrays if multiple files exist for the same key.
            // Convert them to single values if only one is expected, or keep as array.
            const parsedFiles = {};
            for (const key in files) {
                parsedFiles[key] = Array.isArray(files[key]) ? files[key] : [files[key]];
            }

            resolve({ fields: parsedFields, files: parsedFiles });
        });
    });
};

// Important: Next.js API routes with file uploads need to disable body parsing
export const config = {
    api: {
        bodyParser: false,
    },
};