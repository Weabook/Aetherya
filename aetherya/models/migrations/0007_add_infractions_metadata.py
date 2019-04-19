from aetherya.models.migrations import Migrate
from aetherya.models.user import Infraction


@Migrate.only_if(Migrate.missing, Infraction, 'metadata')
def add_guild_columns(m):
    m.add_columns(Infraction, Infraction.metadata)
