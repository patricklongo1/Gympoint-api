import { Op } from 'sequelize';
import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
    async index(req, res) {
        const { q, page = 1 } = req.query;

        const student = q
            ? await Student.findAll({
                  where: { name: { [Op.iLike]: `%${q}%` } },
                  order: ['name'],
                  limit: 10,
                  offset: (page - 1) * 10,
              })
            : await Student.findAll({
                  order: ['name'],
                  limit: 10,
                  offset: (page - 1) * 10,
              });

        return res.json(student);
    }

    async show(req, res) {
        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(400).json({ error: 'Student not found' });
        }

        return res.json(student);
    }

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

        const { id, name, email, age, weight, height } = await Student.create(
            req.body
        ); // substitui const {user} para não retornar tudo.

        return res.json({
            id,
            name,
            email,
            age,
            weight,
            height,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            age: Yup.number(),
            weight: Yup.number(),
            height: Yup.number(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { id } = req.params;
        const student = await Student.findOne({ where: { id } });
        if (!student) {
            return res.status(401).json('User does not exists');
        }

        const { name, email } = req.body;
        if (email && email !== student.email) {
            const studentExists = await Student.findOne({ where: { email } });
            if (studentExists) {
                return res
                    .status(400)
                    .json({ error: 'Student already exists' });
            }
        }

        await student.update(req.body);
        return res.json({
            id,
            name,
            email,
        });
    }

    async destroy(req, res) {
        const { id } = req.params;
        const student = await Student.findByPk(id);

        if (!student) {
            return res.json({ ERROR: 'User does not exists' });
        }

        await student.destroy();
        return res.json({ message: 'User was deleted' });
    }
}

export default new StudentController();
