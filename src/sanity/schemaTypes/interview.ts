export default {
  name: 'interview',
  title: 'Interview',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'date',
      title: 'Date',
      type: 'datetime',
    },
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{type: 'user'}],
    },
    {
      name: 'duration',
      title: 'Duration (minutes)',
      type: 'number',
    },
    {
      name: 'interviewType',
      title: 'Interview Type',
      type: 'string',
      options: {
        list: [
          {title: 'Technical', value: 'technical'},
          {title: 'Behavioral', value: 'behavioral'},
          {title: 'Case Study', value: 'caseStudy'},
        ],
      },
    },
    {
      name: 'qaExchange',
      title: 'Q&A Exchange',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'question',
            title: 'Question',
            type: 'text',
          },
          {
            name: 'answer',
            title: 'Answer',
            type: 'text',
          },
          {
            name: 'aiResponse',
            title: 'AI Response',
            type: 'text',
          }
        ]
      }]
    },
  ],
};