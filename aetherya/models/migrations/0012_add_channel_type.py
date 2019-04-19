from aetherya.models.migrations import Migrate
from aetherya.models.channel import Channel


@Migrate.only_if(Migrate.missing, Channel, 'type_')
def add_channel_type_column(m):
    m.add_columns(Channel, Channel.type_)
