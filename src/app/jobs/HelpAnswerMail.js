import Mail from '../../lib/Mail';

class HelpAnswerMail {
    get key() {
        return 'HelpAnswerMail';
    }

    async handle({ data }) {
        const { helpOrder } = data;
        await Mail.sendMail({
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

export default new HelpAnswerMail();
