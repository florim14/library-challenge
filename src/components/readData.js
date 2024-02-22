const DEFAULT_SERVER = `https://openlibrary.org/search.json?q=`

async function readData({ bookTitle, server = DEFAULT_SERVER, params = null, headers = {}, localInit = {} })
{
    const init = {
        ...{
            method: "GET",
            mode: "cors",
            headers: {
                "accept": "application/fhir+json",
                "accept-encoding": "gzip",
                ...headers
            }
        }, ...localInit
    }

    const uri = `${server}${bookTitle}`
    return fetch(uri, init)
        .then(async response => response.ok ? response.json() : response)
        .catch(error => error)
}

export default readData