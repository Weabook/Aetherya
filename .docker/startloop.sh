
for waitstep in {5..1}
do
    echo "waiting for db to catch up ($waitstep seconds)..";
    sleep 1;
done

export firstNpmStartTime=$(date +%s);
while [ 1 ];
do
    export lastNpmStartTime=$(date +%s);
    npm start;
    export npmExitCode=$?;
    test $npmExitCode -eq 0 && break;
    echo "died for unknown reason; waiting 10 seconds before restarting..";
    sleep 10;
done

echo "died by either interrupt or standard exit; not restarting";