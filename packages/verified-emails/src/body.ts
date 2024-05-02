import { field, variant, serialize, deserialize } from '@dao-xyz/borsh';
import { Ed25519Keypair,toBase64, fromBase64, SignatureWithKey, verify, PublicSignKey} from '@peerbit/crypto'

// Sent in the message body
@variant(0)
export class EmailClaim {
   
    @field({type: PublicSignKey })
    publicKey: PublicSignKey;
    
    // TODO add email (?)
    

    constructor(signer: PublicSignKey)
    {
        this.publicKey = signer
    }
}



const BEGIN_EMAIL_CLAIM = "-----BEGIN EMAIL CLAIM-----"
const END_EMAIL_CLAIM = "-----END EMAIL CLAIM-----"
const NEW_LINE = "%0D%0A";

export const generateEmailBody = async (identity: Ed25519Keypair) => {
    const signature = await identity.sign(serialize(new EmailClaim(identity.publicKey)))
    const signatureString =  toBase64(serialize(signature))
    return `${BEGIN_EMAIL_CLAIM}${NEW_LINE}${signatureString}${NEW_LINE}${END_EMAIL_CLAIM}`
}


export const verifyEmailBody = async (body: string): Promise<PublicSignKey> => {
    
    const signatureWithNewLines = body.split(BEGIN_EMAIL_CLAIM)[1].split(END_EMAIL_CLAIM)[0];
    const signatureBase64 = signatureWithNewLines.split(NEW_LINE)[1]
    const parsedSignature = deserialize(fromBase64(signatureBase64), SignatureWithKey)
    if(!await verify(parsedSignature, serialize(new EmailClaim(parsedSignature.publicKey))))
    {
        throw new Error("Invalid signature")
    }
    return parsedSignature.publicKey
}