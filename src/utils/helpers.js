const isObject = object => object && typeof object === 'object'

const disableTLSRejectUnauthorized = () => process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const getOffset = (page = 1, multiple = 20) =>
    Number.isNaN(page) ? 1 : ((page < 1 ? 1 : page) - 1) * multiple

const deepMerge = (...object) => object.reduce((acc, cur) => {
    Object.keys(cur).forEach(key => {
        acc[key] = Array.isArray(acc[key]) && Array.isArray(cur[key])
            ? [...acc[key], ...cur[key]]
                .filter((value, idx, arr) => arr.indexOf(value) === idx)
            : isObject(acc[key]) && isObject(cur[key])
                ? deepMerge(acc[key], cur[key])
                : cur[key]
    })
    return acc
}, {})

exports.isObject = isObject
exports.deepMerge = deepMerge
exports.getOffset = getOffset
exports.disableTLSRejectUnauthorized = disableTLSRejectUnauthorized
