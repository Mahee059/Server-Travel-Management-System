import bcrypt from "bcryptjs"
export const hashPoassword = async (password: string) => {
    
    const salt = await bcrypt.genSalt(10)
    return await bcrypt .hash(password, salt)
}

export const comparePassword = async (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
}