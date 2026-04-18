

export async function createSession(req, res) {
    try{
        const { problem, difficulty } = req.body;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;
        if(!problem || !difficulty){
            return res.status(400).json({msg: "Problem and difficulty are required"});
        }
        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const session = await Session.create({
            problem,
            difficulty,
            host: userId,
            callId
        });
        await streamClient.video.call("default", callId).getOrCreate({
            data:{
                created_by_id: clerkId,
                custom:{problem,difficulty,sessionId: session._id.toString()},
            },
        });
        const channel=chatClient.channel("messaging",callId,{
            name:`{problem} Session`,
            created_by_id: clerkId,
            members:[clerkId]
        })
        await channel.create();
        res.status(201).json({session});
        }
    catch(err){
        console.error(err);
        res.status(500).json({msg: "Server error"});        
    }
}
export async function getActiveSession(_, res) {
        try{
            const sessions = await Session.find({status:"active"})
            .populate("host","name profileImage email clerkId")
            .sort({createdAt:-1})
            .limit(20);
            res.status(200).json({sessions});
        }
        catch(err){
            console.error(err);
            res.status(500).json({msg: "Server error"});        
        }

}
export async function getMyRecentSessions(req, res) {
    try{
        const userId = req.user._id;
        const sessions = await Session.find({status:"completed",$or:[{host:userId},{participant:userId}]})
        .sort({createdAt:-1})
        .limit(20);
        res.status(200).json({sessions});
    }
    catch(err){
        console.error(err);
        res.status(500).json({msg: "Server error"});        
    }
}
export async function getSessionById(req, res) {
    try{
        const {id} = req.params;
        const session = await Session.findById(id)
        .populate("host","name profileImage email clerkId")
        .populate("participant","name profileImage email clerkId");
        if(!session){
            return res.status(404).json({msg: "Session not found"});
        }
        res.status(200).json({session});
    }
    catch(err){
        console.log("Error fetching session by ID:", err);
        res.status(500).json({msg: "Server error"});        
    }
}
export async function joinSession(req, res) {
    try{
        const {id} = req.params;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;
        const session = await Session.findById(id);
        if(!session){
            return res.status(404).json({msg: "Session not found"});
        }
        if(session.participant){
            return res.status(400).json({msg: "Session is full"});
        }
        session.participant = userId;
        await session.save();
        const channel = chatClient.channel("messaging", session.callId);
        await channel.addMembers([clerkId]);
        res.status(200).json({msg: "Successfully joined session"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({msg: "Server error"});        
    }
}

export async function endSession(req, res) {
    try{
        const {id} = req.params;
        const userId = req.user._id;
        const session = await Session.findById(id);
        if(!session){
            return res.status(404).json({msg: "Session not found"});
        }
        if(session.host.toString() !== userId.toString()){
            return res.status(403).json({msg: "Only host can end the session"});
        }
        if(session.status === "completed"){
            return res.status(400).json({msg: "Session is already completed"});
        }
        session.status = "completed";
        await session.save();
        const call = await streamClient.video.call("default", session.callId);
        await call.delete({hard:true});
        const channel = chatClient.channel("messaging", session.callId);
        await channel.delete();
        res.status(200).json({msg: "Session ended successfully"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({msg: "Server error"});        
    }

}