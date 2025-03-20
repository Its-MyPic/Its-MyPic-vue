/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const data = $root.data = (() => {

    /**
     * Namespace data.
     * @exports data
     * @namespace
     */
    const data = {};

    data.Info = (function() {

        /**
         * Properties of an Info.
         * @memberof data
         * @interface IInfo
         * @property {string|null} [text] Info text
         * @property {number|null} [season] Info season
         * @property {number|null} [episode] Info episode
         * @property {number|null} [frameStart] Info frameStart
         * @property {number|null} [framePrefer] Info framePrefer
         * @property {number|null} [frameEnd] Info frameEnd
         * @property {number|null} [segmentId] Info segmentId
         */

        /**
         * Constructs a new Info.
         * @memberof data
         * @classdesc Represents an Info.
         * @implements IInfo
         * @constructor
         * @param {data.IInfo=} [properties] Properties to set
         */
        function Info(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Info text.
         * @member {string} text
         * @memberof data.Info
         * @instance
         */
        Info.prototype.text = "";

        /**
         * Info season.
         * @member {number} season
         * @memberof data.Info
         * @instance
         */
        Info.prototype.season = 0;

        /**
         * Info episode.
         * @member {number} episode
         * @memberof data.Info
         * @instance
         */
        Info.prototype.episode = 0;

        /**
         * Info frameStart.
         * @member {number} frameStart
         * @memberof data.Info
         * @instance
         */
        Info.prototype.frameStart = 0;

        /**
         * Info framePrefer.
         * @member {number} framePrefer
         * @memberof data.Info
         * @instance
         */
        Info.prototype.framePrefer = 0;

        /**
         * Info frameEnd.
         * @member {number} frameEnd
         * @memberof data.Info
         * @instance
         */
        Info.prototype.frameEnd = 0;

        /**
         * Info segmentId.
         * @member {number} segmentId
         * @memberof data.Info
         * @instance
         */
        Info.prototype.segmentId = 0;

        /**
         * Creates a new Info instance using the specified properties.
         * @function create
         * @memberof data.Info
         * @static
         * @param {data.IInfo=} [properties] Properties to set
         * @returns {data.Info} Info instance
         */
        Info.create = function create(properties) {
            return new Info(properties);
        };

        /**
         * Encodes the specified Info message. Does not implicitly {@link data.Info.verify|verify} messages.
         * @function encode
         * @memberof data.Info
         * @static
         * @param {data.IInfo} message Info message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Info.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.text != null && Object.hasOwnProperty.call(message, "text"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.text);
            if (message.season != null && Object.hasOwnProperty.call(message, "season"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.season);
            if (message.episode != null && Object.hasOwnProperty.call(message, "episode"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.episode);
            if (message.frameStart != null && Object.hasOwnProperty.call(message, "frameStart"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.frameStart);
            if (message.framePrefer != null && Object.hasOwnProperty.call(message, "framePrefer"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.framePrefer);
            if (message.frameEnd != null && Object.hasOwnProperty.call(message, "frameEnd"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.frameEnd);
            if (message.segmentId != null && Object.hasOwnProperty.call(message, "segmentId"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.segmentId);
            return writer;
        };

        /**
         * Encodes the specified Info message, length delimited. Does not implicitly {@link data.Info.verify|verify} messages.
         * @function encodeDelimited
         * @memberof data.Info
         * @static
         * @param {data.IInfo} message Info message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Info.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Info message from the specified reader or buffer.
         * @function decode
         * @memberof data.Info
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {data.Info} Info
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Info.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.data.Info();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.text = reader.string();
                        break;
                    }
                case 2: {
                        message.season = reader.int32();
                        break;
                    }
                case 3: {
                        message.episode = reader.int32();
                        break;
                    }
                case 4: {
                        message.frameStart = reader.int32();
                        break;
                    }
                case 5: {
                        message.framePrefer = reader.int32();
                        break;
                    }
                case 6: {
                        message.frameEnd = reader.int32();
                        break;
                    }
                case 7: {
                        message.segmentId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Info message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof data.Info
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {data.Info} Info
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Info.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Info message.
         * @function verify
         * @memberof data.Info
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Info.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.text != null && message.hasOwnProperty("text"))
                if (!$util.isString(message.text))
                    return "text: string expected";
            if (message.season != null && message.hasOwnProperty("season"))
                if (!$util.isInteger(message.season))
                    return "season: integer expected";
            if (message.episode != null && message.hasOwnProperty("episode"))
                if (!$util.isInteger(message.episode))
                    return "episode: integer expected";
            if (message.frameStart != null && message.hasOwnProperty("frameStart"))
                if (!$util.isInteger(message.frameStart))
                    return "frameStart: integer expected";
            if (message.framePrefer != null && message.hasOwnProperty("framePrefer"))
                if (!$util.isInteger(message.framePrefer))
                    return "framePrefer: integer expected";
            if (message.frameEnd != null && message.hasOwnProperty("frameEnd"))
                if (!$util.isInteger(message.frameEnd))
                    return "frameEnd: integer expected";
            if (message.segmentId != null && message.hasOwnProperty("segmentId"))
                if (!$util.isInteger(message.segmentId))
                    return "segmentId: integer expected";
            return null;
        };

        /**
         * Creates an Info message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof data.Info
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {data.Info} Info
         */
        Info.fromObject = function fromObject(object) {
            if (object instanceof $root.data.Info)
                return object;
            let message = new $root.data.Info();
            if (object.text != null)
                message.text = String(object.text);
            if (object.season != null)
                message.season = object.season | 0;
            if (object.episode != null)
                message.episode = object.episode | 0;
            if (object.frameStart != null)
                message.frameStart = object.frameStart | 0;
            if (object.framePrefer != null)
                message.framePrefer = object.framePrefer | 0;
            if (object.frameEnd != null)
                message.frameEnd = object.frameEnd | 0;
            if (object.segmentId != null)
                message.segmentId = object.segmentId | 0;
            return message;
        };

        /**
         * Creates a plain object from an Info message. Also converts values to other types if specified.
         * @function toObject
         * @memberof data.Info
         * @static
         * @param {data.Info} message Info
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Info.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.text = "";
                object.season = 0;
                object.episode = 0;
                object.frameStart = 0;
                object.framePrefer = 0;
                object.frameEnd = 0;
                object.segmentId = 0;
            }
            if (message.text != null && message.hasOwnProperty("text"))
                object.text = message.text;
            if (message.season != null && message.hasOwnProperty("season"))
                object.season = message.season;
            if (message.episode != null && message.hasOwnProperty("episode"))
                object.episode = message.episode;
            if (message.frameStart != null && message.hasOwnProperty("frameStart"))
                object.frameStart = message.frameStart;
            if (message.framePrefer != null && message.hasOwnProperty("framePrefer"))
                object.framePrefer = message.framePrefer;
            if (message.frameEnd != null && message.hasOwnProperty("frameEnd"))
                object.frameEnd = message.frameEnd;
            if (message.segmentId != null && message.hasOwnProperty("segmentId"))
                object.segmentId = message.segmentId;
            return object;
        };

        /**
         * Converts this Info to JSON.
         * @function toJSON
         * @memberof data.Info
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Info.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Info
         * @function getTypeUrl
         * @memberof data.Info
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Info.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/data.Info";
        };

        return Info;
    })();

    data.Data = (function() {

        /**
         * Properties of a Data.
         * @memberof data
         * @interface IData
         * @property {Array.<data.IInfo>|null} [info] Data info
         */

        /**
         * Constructs a new Data.
         * @memberof data
         * @classdesc Represents a Data.
         * @implements IData
         * @constructor
         * @param {data.IData=} [properties] Properties to set
         */
        function Data(properties) {
            this.info = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Data info.
         * @member {Array.<data.IInfo>} info
         * @memberof data.Data
         * @instance
         */
        Data.prototype.info = $util.emptyArray;

        /**
         * Creates a new Data instance using the specified properties.
         * @function create
         * @memberof data.Data
         * @static
         * @param {data.IData=} [properties] Properties to set
         * @returns {data.Data} Data instance
         */
        Data.create = function create(properties) {
            return new Data(properties);
        };

        /**
         * Encodes the specified Data message. Does not implicitly {@link data.Data.verify|verify} messages.
         * @function encode
         * @memberof data.Data
         * @static
         * @param {data.IData} message Data message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Data.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.info != null && message.info.length)
                for (let i = 0; i < message.info.length; ++i)
                    $root.data.Info.encode(message.info[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Data message, length delimited. Does not implicitly {@link data.Data.verify|verify} messages.
         * @function encodeDelimited
         * @memberof data.Data
         * @static
         * @param {data.IData} message Data message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Data.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Data message from the specified reader or buffer.
         * @function decode
         * @memberof data.Data
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {data.Data} Data
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Data.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.data.Data();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.info && message.info.length))
                            message.info = [];
                        message.info.push($root.data.Info.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Data message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof data.Data
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {data.Data} Data
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Data.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Data message.
         * @function verify
         * @memberof data.Data
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Data.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.info != null && message.hasOwnProperty("info")) {
                if (!Array.isArray(message.info))
                    return "info: array expected";
                for (let i = 0; i < message.info.length; ++i) {
                    let error = $root.data.Info.verify(message.info[i]);
                    if (error)
                        return "info." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Data message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof data.Data
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {data.Data} Data
         */
        Data.fromObject = function fromObject(object) {
            if (object instanceof $root.data.Data)
                return object;
            let message = new $root.data.Data();
            if (object.info) {
                if (!Array.isArray(object.info))
                    throw TypeError(".data.Data.info: array expected");
                message.info = [];
                for (let i = 0; i < object.info.length; ++i) {
                    if (typeof object.info[i] !== "object")
                        throw TypeError(".data.Data.info: object expected");
                    message.info[i] = $root.data.Info.fromObject(object.info[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Data message. Also converts values to other types if specified.
         * @function toObject
         * @memberof data.Data
         * @static
         * @param {data.Data} message Data
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Data.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.info = [];
            if (message.info && message.info.length) {
                object.info = [];
                for (let j = 0; j < message.info.length; ++j)
                    object.info[j] = $root.data.Info.toObject(message.info[j], options);
            }
            return object;
        };

        /**
         * Converts this Data to JSON.
         * @function toJSON
         * @memberof data.Data
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Data.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Data
         * @function getTypeUrl
         * @memberof data.Data
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Data.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/data.Data";
        };

        return Data;
    })();

    return data;
})();

export { $root as default };
