export const NAME = {
    // REGEX: '^[a-z][a-z\s]*$'
    REGEX: '^([a-zA-Z]+\\s)*[a-zA-Z ]+$'
}

export const NUMERIC = {
    REGEX: '^[0-9]*$'
}

export const NUMERICWITHDECIMAL = {
    REGEX: '^[0-9.]*$'
}

export const FAX = {
    REGEX: '^[0-9\\+\\/]*$'
}

export const ALPHANUMERIC = {
    REGEX: '^[a-zA-Z0-9 ]+$'
    // REGEX: '^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$'
}

export const LICENSENUMBER = {
    REGEX: '^[a-zA-Z0-9_\\-\\/]*$'
}

export const ADDRESS = {
    REGEX: '^[a-zA-Z0-9_\\-\\,:# \\/]*$'
    // REGEX: '^[ A-Za-z0-9()[\]+#,.;\/-]*$'
}

export const BLOODGROUP = {
    REGEX: '^(A|B|AB|O|a|b|ab|o)[+-]$'
}

export const EMAIL = {
    REGEX: '^[a-zA-Z0-9.!#$%&"*+/=?^_`{|}~-]+[^@]{3,}@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'
}

export const USERNAME = {
    REGEX:
        '^[a-zA-Z0-9.!#$%&"*+/=?^_`{|}~-]+[^@]{5,}@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.{4,}[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'
};

export const PASSWORD = {
    // REGEX: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#_?&])[A-Za-z\\d@$!%*#_?&]{8,}$'
    REGEX:
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$_!%*?&])[A-Za-z\\d@$_!%*?&]{8,}$'
};

export const URL = {
    REGEX: /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/
       // 'https?://.+'
}