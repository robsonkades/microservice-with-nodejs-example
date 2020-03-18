import File from '~/app/models/File';

class FileController {
  async store(req, res) {
    const { originalName: name, filename: path } = req.file;

    const file = await File.create({ name, path });

    return res.json(file);
  }
}

export default new FileController();
