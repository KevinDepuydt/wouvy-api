import path from 'path';
import crypto from 'crypto';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import env from '../config/env';
import User from '../models/user';
import { getErrorMessage } from '../helpers/error-messages';

const smtpTransport = nodemailer.createTransport(env.mailer.options);
smtpTransport.use('compile', hbs({
  viewEngine: 'handlebars',
  viewPath: path.resolve(path.join(__dirname, '..', 'templates')),
  extName: '.handlebars',
}));

/**
 * Subscribe an User
 */
const signup = (req, res) => {
  const user = new User(req.body);

  user.save((err) => {
    if (err) {
      return res.status(500).send({ message: getErrorMessage(err) });
    }
    // delete user password for security
    user.password = undefined;
    // create a token to authenticate user api call
    const token = jwt.sign(Object.assign({}, user), env.jwtSecret, { expiresIn: env.jwtExpiresIn });
    // return the information including token as JSON
    res.json({ message: 'Inscription réussie!', token });
  });
};

/**
 * Login an User
 */
const signin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      return res.status(400).send(info);
    }
    // delete user password for security
    user.password = undefined;
    // create a token to authenticate user api call
    const token = jwt.sign(Object.assign({}, user), env.jwtSecret, { expiresIn: env.jwtExpiresIn });
    // return the information including token as JSON
    res.json({ message: 'Connexion réussie!', token });
  })(req, res, next);
};

/**
 * Generate a token to reset password and send an email to user email
 */
const forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOneAndUpdate({ email }, { resetToken: crypto.randomBytes(256).toString('hex') }, { new: true })
    .then((user) => {
      const mailOptions = {
        to: user.email,
        from: env.mailer.from,
        subject: 'Réinitialisation du mot de passe Wouvy',
        template: 'password-reset-request',
        context: {
          url: `${env.appUrl}/new-password/${user.resetToken}`,
        },
      };
      smtpTransport.sendMail(mailOptions, (errMail) => {
        if (!errMail) {
          res.send({
            message: `Un email de résiliation du mot de passe à été envoyé à ${email}`,
          });
        } else {
          return res.status(400).send({
            message: "Une erreur s'est produite lors de l'envoie de l'email de résiliation du mot de passe",
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

/**
 * Generate a token to reset password and send an email to user email
 */
const newPassword = (req, res) => {
  const { resetToken, password } = req.body;

  User.findOne({ resetToken })
    .then((user) => {
      user.resetToken = undefined;
      user.password = password;
      user.save()
        .then(() => res.json({ message: 'Votre mot de passe à été mis à jour.' }))
        .catch(err => res.status(500).send({ message: err }));
    })
    .catch(err => res.status(500).send({ message: err }));
};

const socialAuth = (strategy, scope) => (req, res, next) => {
  // Authenticate
  passport.authenticate(strategy, scope)(req, res, next);
};

const socialAuthCallback = strategy => (req, res, next) => {
  passport.authenticate(strategy, (err, user) => {
    if (err || !user) {
      return res.redirect(`${env.appUrl}/auth/callback?error=${JSON.stringify(err)}`);
    }
    // delete user password for security
    user.password = undefined;
    // create a token to authenticate user api call
    const token = jwt.sign(Object.assign({}, user), env.jwtSecret, { expiresIn: env.jwtExpiresIn });
    // redirect to application with token a query parameters
    return res.redirect(`${env.appUrl}/auth/callback?token=${token}`);
  })(req, res, next);
};

export { signup, signin, forgotPassword, newPassword, socialAuth, socialAuthCallback };
