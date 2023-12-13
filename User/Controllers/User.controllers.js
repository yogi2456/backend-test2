import UserModals from "../Modals/User.modals.js";

export const CreateUser = async (req, res) => {
    try {
        const {username, email, type, adminId} = req.body;
        if(!username || !email || !type) return res.status(401).json({success: false, message: "All fields are mandatory"})

        const isAdmin = await UserModals.findOne({_id: adminId, type: "admin"})
        if(!isAdmin) return res.status(401).json({success: false, message: "admin is wrong"})

        const newUser = new User({username, email, type})
        await newUser.save();

        return res.status(200).json({success: true, newUser})
    } catch (error) {
        return res.status(500).json({success: false, message: error})
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