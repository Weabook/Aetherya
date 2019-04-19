def to_tags(obj=None, **kwargs):
    if obj:
        kwargs.update(obj)
    return ['{}:{}'.format(k, v) for k, v in kwargs.items()]
