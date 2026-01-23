
export async function convertFileToString(file:File): Promise<String> {
    return new Promise((resolve, reject)=>{

            const reader = new FileReader();
            reader.onload = () => {
            
                resolve(String(reader.result));
            };
            reader.onerror = () => {
                reject("Error reading the file. Please try again.");
            };
            reader.readAsDataURL(file);
        
    })
            
        
}