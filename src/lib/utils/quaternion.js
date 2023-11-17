let MIN_VAL = 1.0e-7;
let RADIANS = Math.PI / 180;
let DEGREE = 180 / Math.PI;

/** @param {Quat} p
 * @param {Quat} q
 * @returns {Quat}
 */
function product(p, q) {
    let Q = {};
    Q.w = p.w * q.w - p.x * q.x - p.y * q.y - p.z * q.z;
    Q.x = p.w * q.x + p.x * q.w + p.y * q.z - p.z * q.y;
    Q.y = p.w * q.y + p.y * q.w + p.z * q.x - p.x * q.z;
    Q.z = p.w * q.z + p.z * q.w + p.x * q.y - p.y * q.x;
    return Q;
}

/** @param {Quat} p
 * @param {Quat} q
 * @returns {number}
 */
function dot(p, q) {
    return p.w * q.w + p.x * q.x + p.y * q.y + p.z * q.z;
}

/** @param {Quat} q
 * @returns {Quat}
 */
function conjugate(q) {
    let Q = {};
    Q.w = q.w;
    Q.x = -q.x;
    Q.y = -q.y;
    Q.z = -q.z;
    return Q;
}

/** @param {Quat} q
 * @returns {Quat}
 */
function normalize(q) {
    let denom = Math.sqrt(q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z);
    let Q = { w: Infinity, x: Infinity, y: Infinity, z: Infinity };
    if (denom > MIN_VAL) {
        Q.w = q.w / denom;
        Q.x = q.x / denom;
        Q.y = q.y / denom;
        Q.z = q.z / denom;
    }
    return Q;
}

/** @param {Quat} q
 * @returns {number}
 */
function scalar(q) {
    return q.w;
}

/** @param {Quat} q
 * @returns {Point}
 */
function vector(q) {
    return {
        x: q.x,
        y: q.y,
        z: q.z,
    };
}

/** @param {Array<Array<number>>} mat
 * @returns {Quat}
 */
function fromMatrix(mat) {
    let Q = {};
    let tr;
    let s;
    let i;
    let j;
    let k;
    let nxt = [1, 2, 0];
    let q = [0, 0, 0, 0];

    tr = mat[0][0] + mat[1][1] + mat[2][2];

    if (tr > 0.0) {
        s = Math.sqrt(tr + 1.0);
        Q.w = s / 2.0;
        s = 0.5 / s;
        Q.x = (mat[1][2] - mat[2][1]) * s;
        Q.y = (mat[2][0] - mat[0][2]) * s;
        Q.z = (mat[0][1] - mat[1][2]) * s;
    }
    else {
        i = 0;
        if (mat[1][1] > mat[0][0]) {
            i = 1;
        }
        if (mat[2][2] > mat[i][i]) {
            i = 2;
        }
        j = nxt[i];
        k = nxt[j];

        s = Math.sqrt((mat[i][i] - (mat[j][j] + mat[k][k])) + 1.0);
        q[i] = s * 0.5;

        if (s != 0.0)
            s = 0.5 / s;

        q[3] = (mat[j][k] - mat[k][j]) * s;
        q[j] = (mat[i][j] + mat[j][i]) * s;
        q[k] = (mat[i][k] + mat[k][j]) * s;

        Q.x = q[0];
        Q.y = q[1];
        Q.z = q[2];
        Q.w = q[3];
    }
    return Q;
}

/** @param {Quat} q
 * @returns {Array<Array<number>>}
 */
function toMatrix(q) {
    let wx, wy, wz, xx, yy, yz, xy, xz, zz, x2, y2, z2;

    x2 = q.x + q.x;
    y2 = q.y + q.y;
    z2 = q.z + q.z;
    xx = q.x * x2;
    xy = q.x * y2;
    xz = q.x * z2;
    yy = q.y * y2;
    yz = q.y * z2;
    zz = q.z * z2;
    wx = q.w * x2;
    wy = q.w * y2;
    wz = q.w * z2;

    let m = [
        [1.0 - (yy + zz), xy - wz, xz + wy, 0.0],
        [xy + wz, 1.0 - (xx + zz), yz - wx, 0.0],
        [xz - wy, yz + wx, 1.0 - (xx + yy), 0.0],
        [0, 0, 0, 1],
    ];
    return m;
}

/** @param {Quat} q1
 * @param {Quat} q2
 * @param {number} alpha
 * @param {number} spin
 * @returns {Quat}
 */
function slerp(q1, q2, alpha, spin) {
    let beta, theta, sinT, cosT, phi;
    let bflip;
    let qout = {};

    cosT = dot(q1, q2);

    if (cosT < 0.0) {
        cosT = -cosT;
        bflip = 1;
    }
    else {
        bflip = 0;
    }

    if (1.0 - cosT < MIN_VAL) {
        beta = 1.0 - alpha;
    }
    else {
        theta = Math.acos(cosT);
        phi = theta + spin * Math.PI;
        sinT = Math.sin(theta);
        beta = Math.sin(theta - alpha * phi) / sinT;
        alpha = Math.sin(alpha * phi) / sinT;
    }
    if (bflip) {
        alpha = -alpha;
    }
    qout.x = beta * q1.x + alpha * q2.x;
    qout.y = beta * q1.y + alpha * q2.y;
    qout.z = beta * q1.z + alpha * q2.z;
    qout.w = beta * q1.w + alpha * q2.w;

    return normalize(qout);
}

/** @param {number} longitude
 * @param {number} latitude
 * @returns {Quat}
 */
function fromLongLat(longitude, latitude) {
    let q = {};
    let clon, cla;
    let slon, sla;

    clon = Math.cos(longitude / 2 * RADIANS);
    cla = Math.cos(latitude / 2 * RADIANS);
    slon = Math.sin(longitude / 2 * RADIANS);
    sla = Math.sin(latitude / 2 * RADIANS);
    q.w = clon * cla;
    q.x = -slon * sla;
    q.y = clon * sla;
    q.z = slon * cla;
    return q;
}

// convert EulerAngle representation to Quaternion representation. For more info see:
// https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles#Euler_angles_(in_3-2-1_sequence)_to_quaternion_conversion
// here we use it as the pre-multiplication extrinsic zyx rotation.
/** @param {EulerAngle} angle
 * @param {string} [order]
 * @returns {Quat}
 */
function fromAngles(angle, order) {
    order = order || 'd3';
    let cr, cp, cy;
    let sr, sp, sy;
    let roll = angle.roll, pitch = angle.pitch, yaw = angle.yaw;
    let q = {};

    // convert from degree angles to radians
    roll *= RADIANS / 2;
    pitch *= RADIANS / 2;
    yaw *= RADIANS / 2;


    sr = Math.sin(roll), cr = Math.cos(roll);
    sp = Math.sin(pitch), cp = Math.cos(pitch);
    sy = Math.sin(yaw), cy = Math.cos(yaw);

    switch (order) {
        case 'zyx':
            q.w = cr * cp * cy + sr * sp * sy;
            q.x = sr * cp * cy - cr * sp * sy;
            q.y = cr * sp * cy + sr * cp * sy;
            q.z = cr * cp * sy - sr * sp * cy;
            break;
        case 'xyz':
            q.w = cr * cp * cy - sr * sp * sy;
            q.x = sr * cp * cy + cr * sp * sy;
            q.y = cr * sp * cy - sr * cp * sy;
            q.z = sr * sp * cy + cr * cp * sy;
            break;
        case 'd3':
            q.w = cr * cp * cy + sr * sp * sy;
            q.x = cr * sp * sy - sr * cp * cy;
            q.y = cr * sp * cy + sr * cp * sy;
            q.z = cr * cp * sy - sr * sp * cy;
            break;
        default:
            throw new Error(`unknown order of ${order}`);
    }

    return q;
}

// convert Quaternion to EulerAngle representation. For more info see:
// https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles#Quaternion_to_Euler_angles_(in_3-2-1_sequence)_conversion
/** @param {Quat} q
 * @param {string} [order]
 * @returns {EulerAngle}
 */
function toAngles(q, order) {
    order = order || 'd3';
    let a = {};
    switch (order) {
        case 'zyx':
            a.roll = Math.atan2(2 * (q.w * q.x + q.y * q.z), 1 - 2 * (q.x * q.x + q.y * q.y)) * DEGREE;
            a.pitch = Math.asin(Math.max(-1, Math.min(1, 2 * q.w * q.y - 2 * q.z * q.x))) * DEGREE;
            a.yaw = Math.atan2(2 * (q.w * q.z + q.x * q.y), 1 - 2 * (q.y * q.y + q.z * q.z)) * DEGREE;
            break;
        case 'xyz':
            a.yaw = Math.atan2(2 * q.w * q.z - 2 * q.x * q.y, 1 - 2 * (q.y * q.y + q.z * q.z)) * DEGREE;
            a.pitch = Math.asin(Math.max(-1, Math.min(1, 2 * (q.w * q.y + q.x * q.z)))) * DEGREE;
            a.roll = Math.atan2(2 * q.w * q.x - 2 * q.y * q.z, 1 - 2 * (q.x * q.x + q.y * q.y)) * DEGREE;
            break;
        case 'd3':
            a.yaw = Math.atan2(2 * q.w * q.z - 2 * q.x * q.y, 1 - 2 * (q.y * q.y + q.z * q.z)) * DEGREE;
            a.pitch = Math.asin(Math.max(-1, Math.min(1, 2 * (q.w * q.y + q.x * q.z)))) * DEGREE;
            a.roll = Math.atan2(-2 * q.w * q.x + 2 * q.y * q.z, 1 - 2 * (q.x * q.x + q.y * q.y)) * DEGREE;
            break;
        default:
            throw new Error(`unknown order of ${order}`);
    }

    return a;
}

export { product, dot, conjugate, normalize, scalar, vector, fromMatrix, toMatrix, slerp, fromAngles, toAngles, fromLongLat, DEGREE, RADIANS, };

/** @typedef {Object} Quat
 * @property {number} w
 * @property {number} x
 * @property {number} y
 * @property {number} z 
 */
/** @typedef {Object} Point
 * @property {number} x
 * @property {number} y
 * @property {number} z 
 */
/** @typedef {Object} EulerAngle
 * @property {number} roll
 * @property {number} pitch
 * @property {number} yaw 
 */
