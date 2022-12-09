const mongoose = require('mongoose');

const stickerSchema = mongoose.Schema({
    name: {
        type:String,
    },
    description:{
        type:String,
    },
    stickers: {
        type: [String],
        default: [],
    },
});

const Sticker = mongoose.model('Sticker',stickerSchema);
module.exports = Sticker;