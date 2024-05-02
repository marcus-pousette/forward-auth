import smtp from 'smtp-server';
import parser from 'mailparser'

export const start = async (props: { onMessage: (message: parser.ParsedMail) => void }) => {
    const server = new smtp.SMTPServer({
        authOptional: true,
        onData(stream, session, callback) {
            let data = '';

            stream.on('data', chunk => {
                data += chunk.toString();
            });

            stream.on('end', async () => {
                try {
                    const parsedEmail = await parser.simpleParser(data, {})
                    props.onMessage(parsedEmail)
                    callback()
                } catch (error: any) {
                    console.error("Error parsing email", error)
                    callback(error);
                }

            });

            console.log("Received mail", data)
        }
    })
    let port = 25
    server.listen(port)

    // print server info
    console.log('Server running at port 25')

    return { stop: () => { server.close(); }, port }
}

