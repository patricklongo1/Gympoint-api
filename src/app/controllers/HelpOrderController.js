import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
    async index(req, res) {
        const helpOrders = await HelpOrder.findAll({
            where: { answer: null },
            attributes: ['id', 'student_id', 'question'],
        });

        return res.json(helpOrders).limit(20);
    }

    async show(req, res) {
        const { id } = req.params;

        const student = await Student.findByPk(id);
        if (!student) {
            return res.status(401).json({ error: 'Student does not exists' });
        }

        const helpOrders = await HelpOrder.findAll({
            where: { student_id: id },
            attributes: ['id', 'question', 'answer', 'answer_at'],
        });

        return res
            .json(helpOrders)
            .sort({ createdAt: 'desc' })
            .limit(20);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            question: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { id } = req.params;

        const student = await Student.findByPk(id);
        if (!student) {
            return res.status(401).json({ error: 'Student does not exists' });
        }

        await HelpOrder.create({
            student_id: id,
            question: req.body.question,
        });

        return res.json({
            message:
                'Sent with success! You will receive the reply by email soon!',
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            answer: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { id } = req.params;

        const helpOrder = await HelpOrder.findByPk(id);
        if (!helpOrder) {
            return res
                .status(401)
                .json({ error: 'Help Order does not exists' });
        }

        const { answer } = req.body;
        helpOrder.answer = answer;
        helpOrder.answer_at = new Date();
        await helpOrder.save();

        return res.json(helpOrder);
    }
}

export default new HelpOrderController();
