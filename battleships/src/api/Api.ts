const baseUrl = 'http://163.172.177.98:8081'

const baseHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

export const login = async (email: string, password: string): Promise<string> => {
    const result = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({email, password})
    })

    const data = await result.json();
    //console.log(data);

    return data.accessToken;
};

export const register =  async(email: string, password: string) => {
    const result = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({email, password})
    })

    const data = await result.json();
    //console.log(data);
    return data.accessToken;
};

export const getUserDetails = async(token: string) => {
    const result = await fetch(`${baseUrl}/user/details/me`, {
        method: 'GET',
        headers: {
            ...baseHeaders,
            'Authorization': `Bearer ${token}`
        }
    })

    const data = await result.json();
    //console.log(data);
    return data;
}

export const listGames = async(token: string) => {
    const result = await fetch(`${baseUrl}/game`, {
        method: 'GET',
        headers: {
            ...baseHeaders,
            'Authorization': `Bearer ${token}`
        }
    })

    const data = await result.json();
    //console.log(data);
    return data;
}

export const createGame = async(token: string) => {
    const result = await fetch(`${baseUrl}/game`, {
        method: 'POST',
        headers: {
            ...baseHeaders,
            'Authorization': `Bearer ${token}`
        }
    })

    const data = await result.json();
    const text = await result.text();
    //console.log(text);
    return data;
}

export const getGameDetails = async(token: string, gameId: string) => {
    const result = await fetch(`${baseUrl}/game/${gameId}`, {
        method: 'GET',
        headers: {
            ...baseHeaders,
            'Authorization': `Bearer ${token}`
        }
    })

    const data = await result.json();
    //console.log(data);
    return data;
}


export const joinGame = async(token: string, gameId: string) => {
    const result = await fetch(`${baseUrl}/game/join/${gameId}`, {
        method: 'POST',
        headers: {
            ...baseHeaders,
            'Authorization': `Bearer ${token}`
        }
    })

    const data = await result.json();
    //console.log(data);
    return data;
}

export const getGamebyid = async(token: string, gameId: string) => {
    const result = await fetch(`${baseUrl}/game/${gameId}`, {
        method: 'GET',
        headers: {
            ...baseHeaders,
            'Authorization': `Bearer ${token}`
        }
    })

    const data = await result.json();
    //console.log(data);
    return data;
}

export const sendMapconfig = async(token: string, gameId: string, mapconfig: any[]) => {

    const ships = mapconfig.map((ship) => {
        return {
            x: ship.x,
            y: ship.y,
            size: ship.size,
            direction: ship.direction
        }
    });

    const result = await fetch(`${baseUrl}/game/${gameId}`, {
        method: 'PATCH',
        headers: {
            ...baseHeaders,
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ships})
    })

    const data = await result.json();
    //console.log(data);
    return data;
}

export const strike = async(token: string, gameId: string, x: string, y: number) => {
    const result = await fetch(`${baseUrl}/game/strike/${gameId}`, {
        method: 'POST',
        headers: {
            ...baseHeaders,
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({x, y})
    })

    const data = await result.json();
    //console.log(data);
    return data;
}