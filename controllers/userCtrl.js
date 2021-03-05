const Users = require('../models/userModel')
const Payments = require('../models/paymentModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const passwordHash = require('password-hash')


const sender = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'project87890@gmail.com',
        pass: 'kec@7890',
    },
})
function prepareMail(data) {
    let mailBody = {
        from: '"Sports&Fitness" <noreply@sports&fitness.com>', // sender address
        to: "tanishach203@gmail.com," + data.email, // list of receivers
        subject: "Forgot Password", // Subject line
        text: "Forgot Password?", // plain text body
        html: `<p>Hi!</p>
    <p>Please click <a href="${data.link}">Here </a> to reset your password</p>
    <p>Thank you!</p>
    <p>Kind Regards,</p>
    <p>Sports&Fitness</p>`,
    }
    return mailBody
}

function activation(data) {
    let mailBody = {
        from: '"Sports&Fitness" <noreply@sports&fitness.com>', // sender address
        to: "tanishach203@gmail.com," + data.email, // list of receivers
        subject: "Activation", // Subject line
        // text: "Forgot Password?", // plain text body
        html: `<p>Welcome!!</p>
    <p>This is your activation code <u><strong>${data.code} </strong></u></p>
    <p>Thank you!</p>
    <p>Kind Regards,</p>
    <p>Sports&Fitness</p>`,
    }
    return mailBody
}
const userCtrl = {
    register: async (req, res) => {
        try {
            const {
                name,
                email,
                password
            } = req.body;

            const user = await Users.findOne({
                email
            })
            if (user) return res.status(400).json({
                msg: "The email already exists."
            })
            var activeCode = Math.random().toString(36).substr(2, 5)

            // if(password.length < 6) 
            //     return res.status(400).json({msg: "Password is at least 6 characters long."})
            var mailData = {
                code: activeCode,
                email: req.body.email,
                // link: `http://localhost:3000/reset/${user._id}/${user.email}`
            }
            var mailContent = activation(mailData)
            console.log('contents>>>>', mailContent)
         
            // Password Encryption
            const passwordHashes = await bcrypt.hash(password, 10)
            const activationExpiryTime = Date.now() + (1000 * 60 * 60 * 24)
            const newUser = new Users({
                name,
                email,
                password: passwordHashes,
                activationExpiry: activationExpiryTime,
                activeCode: activeCode
            })

            // Save mongodb
            await newUser.save()
            sender.sendMail(mailContent, function (err, done) {
                if (err) {
                    return next(err)
                }
                res.json(done)
                console.log('success')

            })
            // Then create jsonwebtoken to authentication
            const accesstoken = createAccessToken({
                id: newUser._id
            })
            const refreshtoken = createRefreshToken({
                id: newUser._id
            })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })

            res.json({
                accesstoken
            })

        } catch (err) {
            console.log('error is >>>>', err)
            return res.status(500).json({
                msg: err.message
            })
        }
    },
    activeLogin: async (req, res) => {
        try {
            const {
                email,
                password,
                activeCode
            } = req.body;

            Users.findOne({
                    email,
                    activationExpiry: {
                        $gt: Date.now()
                    }
                })
                .exec(async function (err, user) {
                    if (err) {
                        return next(err)
                    }
                    console.log('user is>>>', user)
                    if (!user) {
                        return res.status(400).json({
                            msg: "Something Went Wrong"
                        })
                    }
                    if (activeCode!==user.activeCode) return res.status(400).json({
                        msg: "Incorrect!!"
                    })

                    const isMatch = await bcrypt.compare(password, user.password)
                    if (!isMatch) return res.status(400).json({
                        msg: "Incorrect password."
                    })
                    console.log('activation success', user.activation)
                    user.activation = 'active'
                    console.log('activation', user.activation)
                    await user.save()
                    console.log('new user is>>>', user)

                    if (err) {
                        console.log('error is found', err)
                    }
                })
            // If login success , create access token and refresh token
            const accesstoken = createAccessToken({
                id: user._id
            })
            const refreshtoken = createRefreshToken({
                id: user._id
            })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })

            res.json({
                accesstoken
            })

        } catch (err) {
            return res.status(500).json({
                msg: err.message
            })
        }
    },
    login: async (req, res) => {
        try {
            const {
                email,
                password
            } = req.body;

            const user = await Users.findOne({
                email
            })
            if (!user) return res.status(400).json({
                msg: "User does not exist."
            })
            if (user.activation == 'pending') return res.status(400).json({
                msg: "User does not exist."
            })
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({
                msg: "Incorrect password."
            })

            // If login success , create access token and refresh token
            const accesstoken = createAccessToken({
                id: user._id
            })
            const refreshtoken = createRefreshToken({
                id: user._id
            })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })

            res.json({
                accesstoken
            })

        } catch (err) {
            return res.status(500).json({
                msg: err.message
            })
        }
    },

    forgot: async (req, res) => {
        try {
            const {
                email
            } = req.body;
            console.log('hey>>', req.body)
            const user = await Users.findOne({
                email
            })
            if (!user) return res.status(400).json({
                msg: "The email doesnot exists."
            })
            var mailData = {
                name: user.name,
                email: user.email,
                link: `http://localhost:3000/reset/${user._id}/${user.email}`
            }
            var mailContent = prepareMail(mailData)
            console.log('contents>>>>', mailContent)

            var passwordResetExpiryTime = Date.now() + (1000 * 60 * 60 * 24)
            user.passwordResetExpiry = passwordResetExpiryTime

            await user.save()

            sender.sendMail(mailContent, function (err, done) {
                if (err) {
                    return next(err)
                }
                res.json(done)
                console.log('success')

            })

        } catch (err) {
            console.log('Error>>>>')
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {
                path: '/user/refresh_token'
            })
            return res.json({
                msg: "Logged out"
            })
        } catch (err) {
            return res.status(500).json({
                msg: err.message
            })
        }
    },

    reset: async (req, res) => {
        try {
            const {
                password
            } = req.body;
            console.log('password id>>>', password)
            Users.findOne({
                    _id: req.params.id,
                    passwordResetExpiry: {
                        $gt: Date.now()
                    }
                })
                .exec(async function (err, user) {
                    if (err) {
                        return next(err)
                    }
                    console.log('user is>>>', user)
                    if (!user) {
                        return res.status(400).json({
                            msg: "Password Link expired"
                        })
                    }

                    user.password = await bcrypt.hash(password, 10)
                    user.passwordResetExpiry = null
                    await user.save()
                    console.log('new user is>>>', user)

                    if (err) {
                        console.log('error is found', err)
                    }

                }) // Then create jsonwebtoken to authentication
            const accesstoken = createAccessToken({
                id: newUser._id
            })
            const refreshtoken = createRefreshToken({
                id: newUser._id
            })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })

            res.json({
                accesstoken
            })

        } catch (err) {
            return res.status(500).json({
                msg: err.message
            })
        }
    },

    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({
                msg: "Please Login or Register"
            })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({
                    msg: "Please Login or Register"
                })

                const accesstoken = createAccessToken({
                    id: user.id
                })

                res.json({
                    accesstoken
                })
            })

        } catch (err) {
            return res.status(500).json({
                msg: err.message
            })
        }

    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if (!user) return res.status(400).json({
                msg: "User does not exist."
            })

            res.json(user)
        } catch (err) {
            return res.status(500).json({
                msg: err.message
            })
        }
    },
    addCart: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id)
            if (!user) return res.status(400).json({
                msg: "User does not exist."
            })

            await Users.findOneAndUpdate({
                _id: req.user.id
            }, {
                cart: req.body.cart
            })

            return res.json({
                msg: "Added to cart"
            })
        } catch (err) {
            return res.status(500).json({
                msg: err.message
            })
        }
    },
    history: async (req, res) => {
        try {
            const history = await Payments.find({
                user_id: req.user.id
            })

            res.json(history)
        } catch (err) {
            return res.status(500).json({
                msg: err.message
            })
        }
    }
}


const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '11m'
    })
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
    })
}

module.exports = userCtrl