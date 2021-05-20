const jsonServer = require('json-server');
const jsonfile = require('jsonfile');
const path = require('path');
let multer = require('multer');
const uploadPath = 'public/uploads';
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, uploadPath));
  },
  filename: function (req, file, cb) {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  }
});


let upload = multer({ storage })

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'files.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(upload.single('fileName'), function (req, res, next) {
  const jsonFilePath = path.join(__dirname, 'files.json')
  const jsonContents = jsonfile.readFileSync(jsonFilePath);

  if (req.file !== undefined && req.body !== undefined) {
    const userEmail = req.body.user_email;
    const fileName = req.file.filename;
    const filePath = `./${uploadPath}/${fileName}`;
    const response = { userEmail, fileName, filePath };
    jsonContents.files[jsonContents.files.length] = response;
    jsonfile.writeFileSync(jsonFilePath, jsonContents);
    next(res.json(response));
  }
  else {
    next(res.json(jsonContents));
  }
});
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running and accepting upload file requests at http://localhost:3000/files ')
});
