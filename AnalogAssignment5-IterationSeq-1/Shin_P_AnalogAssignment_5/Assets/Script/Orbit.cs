using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Orbit : MonoBehaviour
{
    public Transform boss;
    public float nextTimeToSearch = 0f;
    public float speed;

    private void Awake()
    {
        FindBoss();
    }

    /* Searches for the boss so that we can obtain the position */
    void FindBoss()
    {
        if (nextTimeToSearch <= Time.time)
        {
            GameObject searchResult = GameObject.FindGameObjectWithTag("Boss");
            if (searchResult != null)
            {
                boss = searchResult.transform;
            }

        }
    }

    

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        OrbitAround();
    }

    /*https://www.youtube.com/watch?v=3PHc6vEckvc */
    void OrbitAround()
    {
        transform.RotateAround(boss.transform.position, Vector3.forward, speed * Time.deltaTime);
    }
}
