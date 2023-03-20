import { Schema, Types, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export type DataSource = {
    name: string;
    URL: string;
    sheetindex: number;
    key: string;
    columns: {name: string, initvalue: string, label: boolean, reference: string, type: string}[];
    owner: string;
    //   organization: Types.ObjectId;
}


// 2. Create a Schema corresponding to the document interface.
const dataSchema = new Schema<DataSource>({
    name: { type: String, required: true },
    URL: {type: String, required: true},
    sheetindex: {type: Number, required: true},
    key: { type: String, required: true },
    columns: { type: [{name: String, initvalue: String, label: Boolean, reference: String, type: String}], required: true },
    owner: { type: String, required: true }
    // And `Schema.Types.ObjectId` in the schema definition.
    //   organization: { type: Schema.Types.ObjectId, ref: 'Organization' }
});

export default model('Data', dataSchema)