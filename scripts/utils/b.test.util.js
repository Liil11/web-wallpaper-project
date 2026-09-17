export default{
    async fetch (request) {
        const target = new URL(request.url).searchParams.get("url");

        if (!target){
            return new Response("missing url", { status: 400 });
        }
        const response = await this.fetch(target);
        const body =await response.text();

        return new Response(body, {
            status: response.status,
            headers: {
                "Content-Type": response.headers.get("Content-Type") || "aplication/json",
                "Accesss-Control-Allow-origin": "*"
            }
        });
    }
};