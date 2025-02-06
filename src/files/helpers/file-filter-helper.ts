

export const fileFilterHelper = ( req: Express.Request, file: Express.Multer.File, callback: Function) => {

    if ( !file ) return callback( new Error('File is empty'), false);

    let fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if ( !validExtensions.includes( fileExtension ) ) 
        return callback( new Error('Invalid file extension'), false);
    

    callback(null, 'nuevo nombre');
}