while read pid; do
  kill -14 $pid
done < pid_file
echo "" > pid_file
