
const registerFixHeight = (componentID:string) => {

    const fixHeight = (componentID:string) => {

        const header_height = document.getElementById ('header')?.clientHeight;
        const footer_height = document.getElementById ('footer')?.clientHeight;
        const window_height = window.innerHeight;
    
        if (document.getElementById (componentID)) {
            document.getElementById (componentID)!.style.height = (window_height - header_height! - footer_height!).toString () + "px";
        }
    }
    
    fixHeight (componentID);

    window.addEventListener ('resize', () => {
        fixHeight (componentID);        
    });
}


export default registerFixHeight;