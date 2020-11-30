export const exampleSch = {
  image: {
    type: String,
    label: 'Imagem',
    defaultValue: '',
    optional: true,
    isImage: true,
  },
  title: {
    type: String,
    label: 'Título',
    defaultValue: '',
    optional: false,

  },
  description: {
    type: String,
    label: 'Descrição',
    defaultValue: '',
    optional: true,
  },
  files: {
    type: [Object],
    label: 'Arquivos',
    defaultValue: '',
    optional: true,
    isUpload:true,
  },
  contacts: {
    type: Object,
    label: 'Contatos',
    defaultValue: '',
    optional: true,
    subSchema: {
      phone: {
        type: String,
        label: 'Telefone',
        defaultValue: '',
        optional: false,
      },
      celphone: {
        type: String,
        label: 'Celular',
        defaultValue: '',
        optional: false,
      },
    }
  }
  tasks: {
    type: [Object],
    label: 'Tarefas',
    defaultValue: '',
    optional: false,
    subSchema: {
      name: {
        type: String,
        label: 'Nome da Tarefa',
        defaultValue: '',
        optional: false,
      },
      description: {
        type: String,
        label: 'Descrição da Tarefa',
        defaultValue: '',
        optional: false,
      },
    }
  }
};

export interface IExample {
  _id?: string;
  image: string;
  title: string;
  description: string;
  createdat: Date;
  updatedat: Date;
  createdby: string;
}
