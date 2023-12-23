import User from "../Modals/User.modals.js";

export const CreateUser = async (req, res) => {
    try {
        const { username, email, type, adminId} = req.body;

        const isAdmin = await User.findOne({ _id: adminId, type: "admin" })
        
        if (!isAdmin) return res.status(401).json({success: false, error: "Admin is wrong." })

        const newUser = new User({ username, email, type });
        await newUser.save();

        res.status(201).json({ success: true, newUser });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

export const DeleteUser = async (req, res) => {
    try {
        const { id, adminId } = req.query;

        const isAdmin = await User.findOne({ _id: adminId, type: "admin" })
        if (!isAdmin) return res.status(401).json({ success: false, error: "Admin is not valid." })

        await User.findByIdAndDelete(id)

        res.status(201).json("User deleted successfully.");

    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

export const ReadUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, users });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}


export const ReadOwnData = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await User.findById(id);
        res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}