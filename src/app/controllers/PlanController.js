import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
    async index(req, res) {
        const { page = 1 } = req.query;
        const plan = await Plan.findAll({
            attributes: ['id', 'title', 'duration', 'price'],
            order: ['title'],
            limit: 10,
            offset: (page - 1) * 10,
        });
        return res.json(plan);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string().required(),
            duration: Yup.number().required(),
            price: Yup.number().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const planExists = await Plan.findOne({
            where: { title: req.body.title },
        });
        if (planExists) {
            return res.status(400).json({ error: 'Plan already exists' });
        }

        const { id, title, duration, price } = await Plan.create(req.body);
        return res.json({
            id,
            title,
            duration,
            price,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string(),
            duration: Yup.number(),
            price: Yup.number(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { id } = req.params;
        const plan = await Plan.findOne({
            where: { id },
        });

        if (!plan) {
            return res.status(401).json({ error: 'Plan does not exists' });
        }

        const { title, duration, price } = req.body;
        if (title !== plan.title) {
            const planExists = await Plan.findOne({
                where: { title },
            });
            if (planExists) {
                return res
                    .status(401)
                    .json({ error: 'This plan already exists' });
            }
        }

        await plan.update(req.body);

        return res.json({
            id,
            title,
            duration,
            price,
        });
    }

    async destroy(req, res) {
        const { id } = req.params;
        const plan = await Plan.findByPk(id);
        await plan.destroy();

        return res.json({ message: 'Plan was deleted' });
    }
}

export default new PlanController();
