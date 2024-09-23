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
      name: 'azureTranscript',
      title: 'Azure Transcript',
      type: 'array',
      of: [{type: 'text'}],
    },
    {
      name: 'geminiResponses',
      title: 'Gemini Responses',
      type: 'array',
      of: [{type: 'text'}],
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
  ],
};