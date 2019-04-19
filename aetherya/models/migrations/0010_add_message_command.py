from aetherya.models.migrations import Migrate
from aetherya.models.message import Message


@Migrate.only_if(Migrate.missing, Message, 'command')
def add_guild_columns(m):
    m.add_columns(Message, Message.command)
