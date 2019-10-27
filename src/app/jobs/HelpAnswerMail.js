import Mail from '../../lib/Mail';

class WellcomeMail {
    get key() {
        return 'WellcomeMail';
    }

    async handle({ data }) {
        const { helpOrder } = data;
        Mail.sendMail({
            to: `${helpOrder.student.name} <${helpOrder.student.email}>`,
            subject: 'Sua dúvida foi respondida!',
            template: 'helpanswer',
            context: {
                student: helpOrder.student.name,
                question: helpOrder.question,
                answer: helpOrder.answer,
            },
        });
    }
}

export default new WellcomeMail();
