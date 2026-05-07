import Footer from "../models/Footer.js";



// Create Footer 
export const createFooter= async(req,res)=>{
    try {
        const footerInfo = await Footer.create(req.body);
        res.status(201).json({
            message:"Footer saved successfully",
            data:footerInfo
        });

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

// Get footer 

export const getFooter= async(req,res)=>{
    try {
        const footerInfo = await Footer.findOne();
        res.json(footerInfo);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

// Update footer

export const updateFooter= async(req,res)=>{
    try {
        const footerInfo = await Footer.findOneAndUpdate({},req.body,{new:true,upsert:true});
        res.json({
            message:"Footer updated successfully",
            data:footerInfo
        });
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}