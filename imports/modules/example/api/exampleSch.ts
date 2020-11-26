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
