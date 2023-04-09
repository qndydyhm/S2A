import { Schema, Types, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export type DataSource = {
    name: string;
    URL: string;
    key: string;
    label: string;
    columns: {name: string, initvalue: string, reference: string, type: string}[];
    owner: string;
    //   organization: Types.ObjectId;
}

const columnSchema = new Schema<{
    name: string, initvalue: string, reference: string, type: string
}>({
    name: {type: String, required: true},
    initvalue: {type: String, required: true},
    reference: {type: String, required: true},
    type: {type: String, required: true}
})

// 2. Create a Schema corresponding to the document interface.
const dataSchema = new Schema<DataSource>({
    name: { type: String, required: true },
    URL: {type: String, required: true},
    key: { type: String, required: true },
    label: {type: String, required: false},
    columns: { type: [columnSchema], required: true },
    owner: { type: String, required: true }
    // And `Schema.Types.ObjectId` in the schema definition.
    //   organization: { type: Schema.Types.ObjectId, ref: 'Organization' }
});

export default model('Data', dataSchema)