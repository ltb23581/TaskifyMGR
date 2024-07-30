const express = require('express');
const bcryptjs = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const user = require('../../models/User');
var bodyParser = require('body-parser');
const User = require('../../models/User');

router.get('/:id', (req, res) => {
    User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(404).json({ nouserfound: 'No User found'}));
   });

router.get('/', (req, res) => {
   User.find()
   .then((users) => res.json(users))
   .catch((err) => res.status(404).json({nousersfound: 'No Users found'}));
});


 // sign up route
 router.post("/signup", bodyParser.json(), async (req, res) => {
    try {
        const {first_name, last_name, email, password, confirmPassword} = req.body;
        if (!email || !password || !confirmPassword || !first_name || !last_name ) {
            return res.status(400).json({msg: 'Please enter all the fields'});
        }
        if (password.length < 6) {
            return res.status(400).json({msg: 'Password should be atleast 6 characters'});
        }
        if (confirmPassword !== password) {
            return res.status(400).json({msg: 'Passwords do not match'});
        }
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({msg: 'User with same email already exists'});
        }
        const hashedPassword = await bcryptjs.hash(password, 8);
        const newUser = new User({email, password: hashedPassword, first_name, last_name});

        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
 });


 // login route
 router.post("/login", bodyParser.json(), async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({msg: 'Please enter all fields'});
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({msg: 'User with this email does not exist'});
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send({msg: 'Incorrect password.'});
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token, user: { id: user._id, email: user.email, phone: user.phone, first_name: user.first_name, last_name: user.last_name, profile_picture: user.profile_picture, members: user.members } });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
 });

 // Check User Still Valid
 router.post("/tokenIsValid", bodyParser.json(), async (req, res) => {
    try {
        const token = req.header("Authorization");
        if (!token) return res.json(false);
        const verified = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
        if (!verified) return res.json(false);
        const user = await User.findById(verified.id);
        if (!user) return res.json(false);
        return res.json(true);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
 });

 // get logged in user data
 router.get('/me', auth, bodyParser.json(), async (req, res) => {
    try {
      // The JWT middleware should append the user ID to the req.user object
      const user = await User.findById(req.user.id).populate('members.user');;
      
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      // Send back the user information excluding the password
      res.json({
        email: user.email,
        phone: user.phone,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_picture: user.profile_picture,
        members: user.members,
        // Include any other user fields you need
      });
      
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

  // add member
  router.put('/newMember', bodyParser.json(), async (req, res) => {
    
    try {
        const user = await User.findById(req.body.primaryUser.id); // Primary user
        if (!user) {
            return res.status(404).send('Primary user not found');          
        }
    
        const memberToAdd = await User.findOne({ email: req.body.memberEmail }); // Member to add
        if (!memberToAdd) {
            return res.status(404).send('Member to add not found');
          
        }
    
        // Check if the member already exists in the primary user's members list
        if (user.members.some(member => member.user.equals(memberToAdd._id))) {
            return res.status(400).send('Member already exists in the user member list');
          
        }
    
        // Add the new member with the role to the primary user's members list
        user.members.push({ user: memberToAdd._id, role: req.body.role });
        await user.save();
        res.json(user);
      } catch (error) {
        return res.status(500).json({error: error.message});
      }
  });

  // Route to delete a member from a user's member list by member ID
router.delete('/user/:userId/members/:memberId', bodyParser.json(), async (req, res) => {
    const { userId, memberId } = req.params;
  
    try {
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the member exists in the user's members list
      const memberIndex = user.members.findIndex(member => member._id.toString() === memberId);
      if (memberIndex === -1) {
        return res.status(404).json({ message: 'Member not found in user member list' });
      }
  
      // Remove the member from the members array
      user.members.splice(memberIndex, 1);
      
      // Save the updated user document
      await user.save();
  
      res.json({ message: 'Member removed from user member list' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete member', error: error });
    }
  });
  
  

module.exports = router;