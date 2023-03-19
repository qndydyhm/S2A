import { Schema, Types, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export type DataSource = {
    name: string;
    URL: string;
    sheetindex: string;
    key: string;
    columns: [{name: string, initvalue: string, lable: string, reference: string, type: string}];
    appid: string;
    //   organization: Types.ObjectId;
}


// 2. Create a Schema corresponding to the document interface.
const dataSchema = new Schema<DataSource>({
    name: { type: String, required: true },
    URL: {type: String, required: true},
    key: { type: String, required: true },
    columns: { type: [{name: String, initvalue: String, lable: String, reference: String, type: String}], required: true },
    appid: { type: String, required: true }
    // And `Schema.Types.ObjectId` in the schema definition.
    //   organization: { type: Schema.Types.ObjectId, ref: 'Organization' }
});

export default model('Data', dataSchema)