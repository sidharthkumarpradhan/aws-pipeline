import base64
from json import loads
from sqlalchemy import desc, asc
from sqlalchemy_serializer import SerializerMixin
from cryptography.fernet import Fernet
import random
import string


def base64ToJson(byte_string):
    base64_string = base64.b64decode(byte_string)
    return loads(base64_string)


def get_tree_rel(result, root=0):
    return_tree = []
    # Traverse the tree and search for direct children of the root
    for el in result:
        # A direct child is found
        parent_id = el.parent_id
        if not el.parent_id:
            parent_id = 0
        if parent_id == root:
            # Check if menu or menu_task item
            if el.menu_task_id:
                # Append the child into result array and parse its children
                return_tree.append({"label": el.menu_label, "seq": el.seq,
                                    "url": el.url, "menu_task_id": el.menu_task_id,
                                    "permission": el.permission})
            else:
                # Append the middle node and parse its children
                return_tree.append({"label": el.menu_label, "seq": el.seq,
                                    "sub_menu": [get_tree_rel(result, el.tree_id)]})
    return return_tree


def getSort(sort_column):
    sort_dir = ''
    if ',' in sort_column:
        s = sort_column.split(',')
        sort_column = s[0]
        sort_dir = s[1]
    else:
        sort_dir = 'asc'
    return asc(sort_column) if sort_dir == "asc" else desc(sort_column)


class my_dictionary(dict):

    # __init__ function
    def __init__(self):
        self = dict()

        # Function to add key:value

    def add(self, key, value):
        self[key] = value


class CustomSerializerMixin(SerializerMixin):
    # date_format = '%s'  # Unixtimestamp (seconds)
    datetime_format = '%Y-%m-%dT%H:%M:%S'
    # decimal_format = '{:0>10.3}'


def load_key():
    """
    Loads the key named `secret.key` from the current directory.
    """
    return open("secret.key", "rb").read()

def encrypt_message(message):
    """
    Encrypts a message
    """
    if message is not None:
        key = load_key()
        encoded_message = message.encode()
        f = Fernet(key)
        encrypted_message = f.encrypt(encoded_message)
        return encrypted_message
    else:
        return None


def decrypt_message(encrypted_message):
    """
    Decrypts an encrypted message
    """
    key = load_key()
    f = Fernet(key)
    if encrypted_message is not None:
        decrypted_message = f.decrypt(bytes(encrypted_message, 'utf-8'))
        return decrypted_message.decode()
    else:
        return None


def ran_gen(size, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for x in range(size)).upper()


