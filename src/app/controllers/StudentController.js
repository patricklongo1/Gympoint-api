import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            age: Yup.number().required(),
            weight: Yup.number().required(),
            height: Yup.number().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const studentExists = await Student.findOne({
            where: { email: req.body.email },
        });
        if (studentExists) {
            return res.status(400).json({ error: 'Student already exists' });
        }

        const { id, name, email } = await Student.create(req.body); // substitui const {user} para não retornar tudo.

        return res.json({
            id,
            name,
            email,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            weight: Yup.number(),
            height: Yup.number(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }
        // console.log(req.userId) utiliza o id do usuario pegando do token de auth, criado em middlewares/auth.js. neste caso
        // não é preciso pegar o id do user por parametro antes de atualizar seus dados, pois este id ja consta no token.
        const { name, email } = req.body;
        const student = await Student.findOne({ where: { name } }); // Melhorar buscando por id.
        if (email !== student.email) {
            const studentExists = await Student.findOne({ where: { email } });

            if (studentExists) {
                return res
                    .status(400)
                    .json({ error: 'Student already exists' });
            }
        }

        const { id } = await student.update(req.body);
        return res.json({
            id,
            name,
            email,
        });
    }
}

export default new StudentController();
